import React, { PureComponent } from "react";
import styled, { withTheme } from "styled-components";
import CardHeader from "./CardHeader";
import { select, s } from "../lib/store";
import { Modal, Input, Select } from "antd";
import { getFilterCounts } from "../lib/queries";
import { Query } from "react-apollo";
import { get, orderBy } from "lodash";
import { max } from "d3-array";
import { scaleBand, scaleLinear, scaleSqrt } from "d3-scale";
import Rule from "./Rule";
import { Tooltip } from "antd";
import { measureText } from "../lib/utils";

import {
    compileRule,
    ruleToString,
    compileLabelFilter
} from "../lib/reducers/filter";

import {
    TrashCanIcon,
    BlockIcon,
    CheckIcon,
    PencilIcon,
    SearchIcon
} from "../primitives/svgIcons";
import theme from "../lib/theme";

const { Option } = Select;
const Container = styled.div`
    height: 100%;
    width: 100%;
    box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.08);
    background-color: ${({ special }) => (special ? "#f8faff" : "white")};
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    border: ${({ theme, selected }) =>
        selected && `solid 2px ${theme.colors.primary}`};
    &:hover {
        z-index: 100;
        .rule {
            background-color: #f5f5f5;
        }
    }
    padding: 10px;
    cursor: default;
`;

const RowGroup = styled.g`
    cursor: default;
    .background-rect {
        transition: fill 0.2s;
        fill: ${({ selected }) =>
            selected ? theme.colors.lightPrimary + " !important" : "white"};
    }
    &:hover .background-rect {
        fill: ${({ theme }) => theme.colors.veryLightPrimary};
    }
    .row-icon {
        transition: opacity 0.2s;
        opacity: 0;
    }
    &:hover .row-icon {
        opacity: 1;
    }
`;

const RuleContainer = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
`;

class RuleListLabelCard extends PureComponent {
    constructor() {
        super();
        this.state = {};
    }
    renderRules() {
        const { data } = this.props;
        const Rules = data.Rules || [];
        return (
            <RuleContainer>
                {Rules.map(r => (
                    <Rule
                        key={r.rule}
                        rule={r}
                        editRule={this.editRule}
                        remove={this.removeRule}
                        changeType={this.changeRuleType}>
                        {r.rule}
                    </Rule>
                ))}
            </RuleContainer>
        );
    }
    getExtendedData() {
        const { data, textField, datasetId } = this.props;

        let Rules = data.Rules || [];
        Rules = Rules.map(r => ({ ID: ruleToString(r), Filter: r }));

        let filters = Rules.map(d => ({
            Key: d.ID,
            Filter: compileRule(d.Filter, { textField })
        }));

        let matrixFilters = Rules.map(d => ({
            Name: d.ID,
            Filter: compileRule(d.Filter, { textField })
        }));

        let variables = {
            ID: datasetId,
            splitFilters: filters,
            adjFilters: matrixFilters,
            filter: compileLabelFilter(data, { textField })
        };
        return { query: getFilterCounts, variables };
    }

    extendedDataParser(result) {
        let global = get(result, ["data", "Dataset", "Global", "Split"]);
        let local = get(result, ["data", "Dataset", "Local", "Split"]);
        let localMatrix =
            get(result, ["data", "Dataset", "Local", "AdjMatrix", "Links"]) ||
            [];
        let globalMatrix =
            get(result, ["data", "Dataset", "Global", "AdjMatrix", "Links"]) ||
            [];

        const Rules = this.props.data.Rules || [];
        let localLinks = {};
        let globalLinks = {};
        if (!local) return { data: [] };

        const setLink = (links, source, dest, count) => {
            let currentLinks = links[source] || {};
            currentLinks[dest] = {
                Key: dest,
                Count: count
            };
            links[source] = currentLinks;
        };
        for (let link of localMatrix) {
            let k1 = link.Key[0];
            let k2 = link.Key[1];
            setLink(localLinks, k1, k2, link.Count);
            setLink(localLinks, k2, k1, link.Count);
        }

        for (let link of globalMatrix) {
            let k1 = link.Key[0];
            let k2 = link.Key[1];
            setLink(globalLinks, k1, k2, link.Count);
            setLink(globalLinks, k2, k1, link.Count);
        }

        let data = global.map(g => {
            let l = local.find(_ => _.Key === g.Key);
            let r = Rules.find(_ => g.Key === ruleToString(_));

            return {
                ...r,
                Key: g.Key,
                Local: l.Size,
                Global: g.Size,
                Out: g.Size - l.Size,
                localLinks: localLinks[g.Key] || {},
                globalLinks: globalLinks[g.Key] || {}
            };
        });
        return { data };
    }
    drawExtendedBody(result) {
        const { width, height, theme, searchSetKeyword } = this.props;

        const rowHeight = 30;
        const ColumnsInfo = {
            rule: {
                width: 150
            },
            bars: {
                x: 250,
                barsHeight: 10,
                barsWidth: 100
            }
        };
        let { data } = this.extendedDataParser(result);
        if (!data || data.length === 0) return <RuleContainer />;
        data = orderBy(data, "type", "desc");
        let firstNegative = data.find(d => d.type === "NEGATIVE") || {};

        let bodyHeight = data.length * rowHeight;
        let svgWidth = width - 30;
        let bodyWidth = svgWidth - 20;

        let negativeSpacing = 20;

        let rowScale = scaleBand()
            .domain(data.map(d => d.Key))
            .range([0, bodyHeight]);
        let barsScale = scaleLinear()
            .range([0, ColumnsInfo.bars.barsWidth])
            .domain([0, max(data, d => d.Global)]);

        let linkScale = scaleSqrt().range([0, rowHeight / 2 - 1]);
        let selected = this.state.selected || this.state.hovering;
        if (selected) {
            linkScale.domain([0, selected.Global]);
        }
        let fontSize = 14;
        let fontFamily = "Helvetica Neue";
        data = data.map(d => {
            let size = measureText(d.Key, fontSize, fontFamily);
            if (size.width > ColumnsInfo.rule.width) {
                let candidate = d.Key;
                for (let slice = d.Key.length; slice > 0; slice--) {
                    candidate = candidate.slice(0, -1);
                    let size = measureText(
                        candidate + "...",
                        fontSize,
                        fontFamily
                    );
                    if (size.width < ColumnsInfo.rule.width) {
                        d.Label = candidate + "...";
                        break;
                    }
                }
            } else {
                d.Label = d.Key;
            }

            return d;
        });

        return (
            <div
                onClick={() => {
                    this.setState({ selected: null });
                }}
                style={{
                    height: height - 70,
                    width: svgWidth,
                    overflowY: "auto",
                    overflowX: "hidden"
                }}>
                <svg
                    width={svgWidth}
                    height={bodyHeight + 100}
                    onClick={e => e.stopPropagation()}>
                    <g
                        style={{ transition: "transform 0.5s" }}
                        transform={`translate(10,30)`}>
                        <g transform={`translate(0, -10)`}>
                            <text style={{ fontWeight: "bold" }}>Positive</text>
                        </g>
                        <line
                            x1="0"
                            x2={bodyWidth}
                            y1={0}
                            y2={0}
                            stroke="#eee"
                        />
                        {firstNegative.Key && (
                            <g
                                style={{ transition: "transform 0.5s" }}
                                transform={`translate(0, ${rowScale(
                                    firstNegative.Key
                                ) +
                                    rowHeight +
                                    negativeSpacing / 2})`}>
                                <text style={{ fontWeight: "bold" }}>
                                    Negative
                                </text>
                                <line
                                    x1="0"
                                    x2={bodyWidth}
                                    y1={10}
                                    y2={10}
                                    stroke="#eee"
                                />
                            </g>
                        )}

                        {data.map((r, idx) => (
                            <RowGroup
                                selected={
                                    this.state.selected &&
                                    this.state.selected.Key === r.Key
                                }
                                key={r.Key}
                                style={{ transition: "transform 0.5s" }}
                                onMouseEnter={() => {
                                    this.setState({ hovering: r });
                                }}
                                onMouseLeave={() => {
                                    this.setState({ hovering: null });
                                }}
                                onClick={() => {
                                    this.setState({
                                        selected: this.state.selected ? null : r
                                    });
                                }}
                                transform={`translate(0,${rowScale(r.Key) +
                                    (r.type === "NEGATIVE"
                                        ? rowHeight + negativeSpacing
                                        : 0)})`}>
                                <rect
                                    width={bodyWidth}
                                    height={rowHeight}
                                    className="background-rect"
                                />
                                <Tooltip title="Edit Rule">
                                    <PencilIcon
                                        className="row-icon"
                                        onClick={() =>
                                            this.editRule({
                                                rule: r.Key,
                                                type: r.type
                                            })
                                        }
                                        scale={0.5}
                                        transform="translate(0,4) scale(0.8)"
                                    />
                                </Tooltip>
                                {r.Label !== r.Key ? (
                                    <Tooltip title={r.Key}>
                                        <text
                                            alignmentBaseline="middle"
                                            style={{
                                                fill:
                                                    r.type === "NEGATIVE"
                                                        ? "#d55"
                                                        : ""
                                            }}
                                            dx={24}
                                            dy={rowHeight / 2}>
                                            {r.Label}
                                        </text>
                                    </Tooltip>
                                ) : (
                                    <text
                                        alignmentBaseline="middle"
                                        style={{
                                            fill:
                                                r.type === "NEGATIVE"
                                                    ? "#d55"
                                                    : ""
                                        }}
                                        dx={24}
                                        dy={rowHeight / 2}>
                                        {r.Label}
                                    </text>
                                )}
                                {selected && (
                                    <Tooltip
                                        title={`${get(r, [
                                            "localLinks",
                                            selected.Key,
                                            "Count"
                                        ]) || 0}/${get(r, [
                                            "globalLinks",
                                            selected.Key,
                                            "Count"
                                        ]) || 0}`}>
                                        <g
                                            onClick={e => {
                                                searchSetKeyword(
                                                    `(${r.Key}) AND (${
                                                        selected.Key
                                                    })`
                                                );
                                                e.stopPropagation();
                                            }}>
                                            <circle
                                                cx={
                                                    ColumnsInfo.bars.x -
                                                    rowHeight -
                                                    10
                                                }
                                                stroke={
                                                    selected.Key === r.Key
                                                        ? "white"
                                                        : "#eee"
                                                }
                                                fill="none"
                                                cy={rowHeight / 2}
                                                r={linkScale(
                                                    get(selected, ["Global"]) ||
                                                        0
                                                )}
                                            />
                                            <circle
                                                cx={
                                                    ColumnsInfo.bars.x -
                                                    rowHeight -
                                                    10
                                                }
                                                fill="#eee"
                                                cy={rowHeight / 2}
                                                r={linkScale(
                                                    get(r, [
                                                        "globalLinks",
                                                        selected.Key,
                                                        "Count"
                                                    ]) || 0
                                                )}
                                            />
                                            <circle
                                                cx={
                                                    ColumnsInfo.bars.x -
                                                    rowHeight -
                                                    10
                                                }
                                                fill={theme.colors.primary}
                                                cy={rowHeight / 2}
                                                r={linkScale(
                                                    get(r, [
                                                        "localLinks",
                                                        selected.Key,
                                                        "Count"
                                                    ]) || 0
                                                )}
                                            />
                                        </g>
                                    </Tooltip>
                                )}

                                <line
                                    x1="0"
                                    x2={bodyWidth}
                                    y1={rowHeight}
                                    y2={rowHeight}
                                    stroke="#eee"
                                />
                                <g
                                    transform={`translate(${
                                        ColumnsInfo.bars.x
                                    },0)`}>
                                    <rect
                                        width={barsScale(r.Global)}
                                        y={
                                            rowHeight / 2 -
                                            ColumnsInfo.bars.barsHeight / 2
                                        }
                                        height={ColumnsInfo.bars.barsHeight}
                                        fill="#ddd"
                                    />
                                    <rect
                                        width={barsScale(r.Local)}
                                        y={
                                            rowHeight / 2 -
                                            ColumnsInfo.bars.barsHeight / 2
                                        }
                                        height={ColumnsInfo.bars.barsHeight}
                                        fill={theme.colors.primary}
                                    />
                                    <text
                                        alignmentBaseline="middle"
                                        style={{
                                            fontSize: "10px",
                                            fill:
                                                r.type === "NEGATIVE"
                                                    ? "#d55"
                                                    : ""
                                        }}
                                        dx={barsScale(r.Global) + 5}
                                        dy={rowHeight / 2}>
                                        {r.Local} / {r.Global}
                                    </text>
                                </g>
                                <g
                                    transform={`translate(${bodyWidth -
                                        40},${rowHeight / 2 - 10})`}>
                                    <Tooltip title="Remove Rule">
                                        <TrashCanIcon
                                            className="row-icon"
                                            scale={0.8}
                                            onClick={e => {
                                                this.removeRule(r.Key);
                                            }}
                                        />
                                    </Tooltip>

                                    <Tooltip title="Show documents">
                                        <SearchIcon
                                            className="row-icon"
                                            scale={0.8}
                                            onClick={e => {
                                                searchSetKeyword(r.Key);
                                            }}
                                            transform="translate(-40,0) scale(0.8)"
                                        />
                                    </Tooltip>

                                    {r.type === "NEGATIVE" ? (
                                        <Tooltip title="Set rule as positive">
                                            <CheckIcon
                                                className="row-icon"
                                                onClick={() =>
                                                    this.changeRuleType(
                                                        r.Key,
                                                        "POSITIVE"
                                                    )
                                                }
                                                scale={0.6}
                                                transform="translate(-20,0) scale(0.8)"
                                            />
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title="Set rule as negative">
                                            <BlockIcon
                                                className="row-icon"
                                                onClick={() =>
                                                    this.changeRuleType(
                                                        r.Key,
                                                        "NEGATIVE"
                                                    )
                                                }
                                                scale={0.6}
                                                transform="translate(-20,0) scale(0.8)"
                                            />
                                        </Tooltip>
                                    )}
                                </g>
                            </RowGroup>
                        ))}
                    </g>
                </svg>
            </div>
        );
    }
    renderRulesExtended() {
        const query = this.getExtendedData();
        return (
            <Query {...query}>
                {result => {
                    if (result.data) {
                        this.dataCache = result;
                    }
                    return this.drawExtendedBody(this.dataCache);
                }}
            </Query>
        );
    }

    changeRuleType = (rule, newType) => {
        const { updateLabelSetRule, data } = this.props;
        updateLabelSetRule(data.ID, rule, { type: newType }, "Card");
    };
    removeRule = ruleName => {
        const { removeLabelSetRule, data } = this.props;
        removeLabelSetRule(data.ID, ruleName, "Card");
    };
    addRule = () => {
        return this.editRule();
    };
    editRule = rule => {
        const { data, addLabelSetRule, updateLabelSetRule } = this.props;
        let keyword = rule ? rule.rule : "";
        let match = "POSITIVE";
        const onOk = () => {
            let keywords = keyword
                .split(",")
                .map(k => k.trim())
                .filter(k => k);

            if (rule) {
                let ruleKeyword = keywords.shift();
                if (!ruleKeyword) {
                    alert("Rule not provided");
                } else {
                    updateLabelSetRule(
                        data.ID,
                        rule.rule,
                        {
                            rule: ruleKeyword,
                            type: match
                        },
                        "Card"
                    );
                    if (keywords.length > 0) {
                        addLabelSetRule(
                            data.ID,
                            keywords.map(r => ({
                                rule: r,
                                type: match
                            })),
                            "Card"
                        );
                    }
                }
            } else {
                addLabelSetRule(
                    data.ID,
                    keywords.map(r => ({
                        rule: r,
                        type: match
                    })),
                    "Card"
                );
            }
        };
        const ref = Modal.confirm({
            width: 600,
            title: rule ? "Edit rule " : "Please provide a keywords to add. ",
            content: (
                <div style={{ paddingTop: "20px" }}>
                    <Input
                        ref={node => {
                            if (node) {
                                setTimeout(() => {
                                    node.input.focus();
                                }, 100);
                            }
                        }}
                        onKeyPress={e => {
                            if (e.key === "Enter") {
                                onOk();
                                ref.destroy();
                            }
                        }}
                        defaultValue={keyword}
                        style={{ width: "100%" }}
                        onChange={e => (keyword = e.target.value)}
                    />
                    <div style={{ marginTop: "10px" }}>
                        <Select
                            defaultValue={match}
                            style={{ width: "100%" }}
                            onChange={value => (match = value)}>
                            <Option value="POSITIVE">
                                <b style={{ color: theme.colors.primary }}>
                                    POSITIVE:
                                </b>{" "}
                                Include documents that satisfy this rule(s)
                            </Option>

                            <Option value="NEGATIVE">
                                <b style={{ color: theme.colors.remove }}>
                                    NEGATIVE:
                                </b>{" "}
                                Discard documents that satisfy this rule(s)
                            </Option>
                            {/* </OptGroup> */}
                        </Select>
                    </div>
                    <div style={{ marginTop: "20px" }}>
                        <div style={{ fontWeight: "bold" }}>Help</div>
                        <ul>
                            <li>
                                You can separate multiple words separated by
                                comma(,).
                            </li>
                            <li>
                                To add bigrams enclose them with quotes (e.g
                                "new york").
                            </li>
                            <li>
                                You can use AND or OR between words (e.g. warm
                                OR hot).
                            </li>
                            <li>
                                To query another field other then the default
                                use colon (:) between the field and the query
                                (e.g. title:visualization).
                            </li>
                            <li>
                                You can use tilde(~) with a number to specify a
                                fuzzi query where words are allowed between
                                words (e.g. "weather california"~3).
                            </li>
                        </ul>
                    </div>
                </div>
            ),
            okText: rule ? "Update" : "Add",
            cancelText: "Cancel",
            onOk: onOk,
            onCancel() {}
        });
    };
    render() {
        const {
            data,
            setLabelSetName,
            setLabelSetExpanded,
            removeLabelSetLabel,
            labelsSetSelection,
            selectedLabels = [],
            count,
            exclusive
        } = this.props;
        let idx = selectedLabels.findIndex(f => f === data.ID);
        let selected = idx >= 0;

        return (
            <Container
                special={data.TYPE}
                selected={selected}
                onClick={e => {
                    e.stopPropagation();
                    for (let menu in this.state.menuVisibility) {
                        if (this.state.menuVisibility[menu]) {
                            return;
                        }
                    }
                    labelsSetSelection(data.ID);
                }}>
                <CardHeader
                    data={data}
                    isMenuVisible={false}
                    exclusive={exclusive}
                    setLabelSetName={setLabelSetName}
                    setLabelSetExpanded={setLabelSetExpanded}
                    removeLabel={removeLabelSetLabel}
                    addRule={this.addRule}
                    count={count}
                    setMenuVisible={(menu, state) => {
                        this.setState({
                            menuVisibility: {
                                ...this.state.menuVisibility,
                                [menu]: state
                            }
                        });
                    }}
                />
                {data.expanded
                    ? this.renderRulesExtended()
                    : this.renderRules()}
            </Container>
        );
    }
}

export default select(
    ["selectedLabels:filter.selectedLabels", s.textField, s.datasetID],
    [
        "setLabelSetName",
        "setLabelSetExpanded",
        "removeLabelSetLabel",
        "addLabelSetRule",
        "labelsSetSelection",
        "removeLabelSetRule",
        "updateLabelSetRule",
        "searchSetKeyword"
    ]
)(withTheme(RuleListLabelCard));
