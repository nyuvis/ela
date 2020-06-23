import React, { PureComponent } from "react";
import { scaleLinear } from "d3-scale";
import { withTheme } from "styled-components";
import { removeItem } from "../lib/utils";
import { Select, Button } from "antd";
import { select, s } from "../lib/store";

const { Option } = Select;

class KeywordSummary extends PureComponent {
    constructor() {
        super();
        this.state = {
            selected: [],
            addTo: "__new_topic__"
        };
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            selected: nextProps.selectedKeywords,
            addTo: "__new_topic__"
        });
    }

    render() {
        const {
            width,
            height,
            numColumns,
            numRows,
            textStyle,
            labels = [],
            theme,
            data = [],
            addIgnoredKeywords,
            addToSpecialLabel,
            onSelectionChange
        } = this.props;

        let rowHeight = (height - 10) / numRows;
        let colWidth = width / numColumns;
        const barScale = scaleLinear()
            .range([0, colWidth - 10])
            .domain([0, Math.max(...data.map(d => d.Stat))]);

        let selected = new Set(this.state.selected);

        return (
            <div>
                <svg
                    width={width}
                    height={height}
                    style={{ border: "solid 0px #ccc", cursor: "pointer" }}>
                    <g transform="translate(5, 5)">
                        {data.map((k, i) => (
                            <g
                                className="noselect"
                                onDoubleClick={() => {
                                    this.doubled = 2;
                                    this.props.searchSetKeyword(k.Key);
                                }}
                                onClick={e => {
                                    setTimeout(() => {
                                        if (this.doubled) {
                                            this.doubled -= 1;
                                        } else {
                                            let selectedValues = this.state
                                                .selected;
                                            if (selected.has(k.Key)) {
                                                selectedValues = removeItem(
                                                    this.state.selected,
                                                    item => item === k.Key
                                                );
                                            } else {
                                                selectedValues = [
                                                    ...this.state.selected,
                                                    k.Key
                                                ];
                                            }
                                            this.setState({
                                                selected: selectedValues
                                            });
                                            onSelectionChange(selectedValues);
                                        }
                                    }, 200);
                                }}
                                key={k.Key}
                                transform={`translate(${Math.floor(
                                    i / numRows
                                ) * colWidth},${(i % numRows) * rowHeight})`}>
                                <rect
                                    y={4}
                                    height={rowHeight - 4}
                                    width={barScale(k.Stat)}
                                    fill={theme.colors.lightPrimary}
                                />
                                <text
                                    dy={rowHeight / 2}
                                    dx={selected.has(k.Key) ? -8 : 2}
                                    alignmentBaseline="central"
                                    style={{
                                        ...textStyle,
                                        fill: selected.has(k.Key) && "#1890ff",
                                        fontWeight:
                                            selected.has(k.Key) && "bold"
                                    }}>
                                    {selected.has(k.Key) && ">"}
                                    {k.Key}
                                </text>
                                <title>{k.Stat}</title>
                            </g>
                        ))}
                    </g>
                </svg>
                {selected.size > 0 && (
                    <div>
                        <div>Add selected to:</div>
                        <Select
                            showArrow={true}
                            style={{ width: "300px" }}
                            value={this.state.addTo}
                            onChange={e => {
                                this.setState({
                                    addTo: e
                                });
                            }}>
                            <Option value="__new_topic__">...New topic</Option>
                            {labels.map(label => (
                                <Option key={label.ID} value={label.ID}>
                                    {label.Name}
                                </Option>
                            ))}
                        </Select>
                        <Button
                            onClick={() => {
                                const { selected, addTo } = this.state;
                                const {
                                    addLabel,
                                    addLabelSetRule
                                } = this.props;
                                if (addTo === "__new_topic__") {
                                    let name = prompt(
                                        "Provide a name for the topic"
                                    );
                                    addLabel(
                                        name,
                                        selected.map(s => ({
                                            rule: s,
                                            type: "POSITIVE"
                                        })),
                                        "KeywordSummary"
                                    );
                                } else {
                                    addLabelSetRule(
                                        addTo,
                                        selected.map(r => ({ rule: r })),
                                        "KeywordSummary"
                                    );
                                }

                                this.setState({
                                    selected: [],
                                    addTo: "__new_topic__"
                                });
                            }}>
                            Add
                        </Button>
                        <div style={{ marginTop: "5px" }}>
                            <b>Ignore:</b>
                            <div>
                                <Button
                                    style={{ marginRight: "5px" }}
                                    onClick={() => {
                                        addIgnoredKeywords(this.state.selected);
                                    }}>
                                    Ignore Keywords
                                </Button>
                                <Button
                                    onClick={() => {
                                        addToSpecialLabel(
                                            "IGNORE",
                                            this.state.selected.map(s => ({
                                                rule: s,
                                                type: "POSITIVE"
                                            })),
                                            "KeywordSummary"
                                        );
                                    }}>
                                    Ignore Documents
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default select(
    [s.labels],
    [
        "addLabel",
        "addLabelSetRule",
        "searchSetKeyword",
        "addIgnoredKeywords",
        "addToSpecialLabel"
    ]
)(withTheme(select([])(KeywordSummary)));
