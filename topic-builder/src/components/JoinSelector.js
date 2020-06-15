import React, { PureComponent } from "react";
import { Select } from "antd";
import { select, s } from "../lib/store";
import { difference, get } from "lodash";
import styled from "styled-components";

const LinkButton = styled.button`
    border: none;
    background: none;
    color: ${({ theme }) => theme.colors.primary};
    padding: 5px;
    outline: none;
    cursor: pointer;
`;

class JoinSelection extends PureComponent {
    constructor() {
        super();
        this.state = {
            joinMethod: "all",
            selection: {}
        };
    }
    changeJoin = e => {
        this.props.setJoinMethod(e);
    };
    setJoinMode(mode) {
        this.setState({ joinMethod: mode });
    }

    changeSelection({ selector, value }) {
        const { setJoinMethod, joinMethod } = this.props;
        let selection = joinMethod;
        let result = {};
        for (let key in selection) {
            result[key] = difference(selection[key], value);
        }
        result[selector] = value;
        setJoinMethod(result);
    }

    hasLabelSelected() {
        let values = this.getPossibleValues();
        let selection = this.props.joinMethod;
        for (let key in selection) {
            let diff = difference(selection[key], values);
            if (diff.length > 0) return true;
        }
        return false;
    }
    getPossibleValues() {
        return ["search", "projection", "selectedLabels", "anyLabel"];
    }
    getValues() {
        const { filter = {}, labels = [] } = this.props;
        let hasLabelSelected = this.hasLabelSelected();

        let values = [];
        if (get(filter, ["search", "length"], 0) > 0) {
            values.push({
                value: "search",
                label: "Search"
            });
        }

        if (get(filter, ["projection", "or", "length"], 0) > 0) {
            values.push({
                value: "projection",
                label: "Projection"
            });
        }
        if (get(filter, ["selectedLabels", "length"], 0) > 0) {
            values.push({
                value: "selectedLabels",
                label: "Selected Labels" + (hasLabelSelected ? " (Other)" : "")
            });
        } else if (labels.length > 0) {
            values.push({
                value: "anyLabel",
                label: "Covered by Model"
            });
        }
        return values;
    }

    getSelection() {}
    getLabels() {
        const { labels = [] } = this.props;
        return labels;
    }
    getSelector(selector) {
        let values = this.getValues();
        const { joinMethod } = this.props;
        let selection = joinMethod;
        let labels = this.getLabels();

        return (
            <Select
                style={{ width: "100%" }}
                mode="multiple"
                value={selection[selector] || []}
                allowClear={true}
                ref={node => {
                    this[`${selector}Select`] = node;
                }}
                onSelect={(e, c, d, k) => {
                    this[`${selector}Select`].blur();
                }}
                onChange={value => {
                    this.changeSelection({ selector, value });
                }}>
                <Select.OptGroup label="Basic">
                    {values.map(v => (
                        <Select.Option key={v.value} value={v.value}>
                            {v.label}
                        </Select.Option>
                    ))}
                </Select.OptGroup>
                <Select.OptGroup label="Labels">
                    {labels.map(v => (
                        <Select.Option key={v.ID} value={v.ID}>
                            {v.Name}
                        </Select.Option>
                    ))}
                </Select.OptGroup>
            </Select>
        );
    }

    // {labels.length > 0 && (
    //     <Select.OptGroup label="Labels">

    //     </Select.OptGroup>
    // )}
    render() {
        const selectors = ["ALL", "ANY", "NOT"];

        return (
            <div
                style={{
                    backgroundColor: "white",
                    padding: "0px 10px 10px 10px",
                    borderBottom: "solid 1px #ccc"
                }}>
                <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Show:
                </div>
                <table border="0" style={{ width: "100%" }}>
                    <tbody>
                        {selectors.map(s => (
                            <tr key={s}>
                                <td style={{ width: "50px" }}>{s}: </td>
                                <td>{this.getSelector(s)}</td>
                                <td style={{ width: "20px" }}>
                                    <LinkButton
                                        onClick={() => {
                                            let value = this.getValues().map(
                                                v => v.value
                                            );

                                            this.changeSelection({
                                                selector: s,
                                                value
                                            });
                                        }}>
                                        All
                                    </LinkButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default select(
    ["filter", "joinMethod:filter.joinMethod", s.labels],
    ["setJoinMethod", "addLabelIDToJoinMethod"]
)(JoinSelection);
