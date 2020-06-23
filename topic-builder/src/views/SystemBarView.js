import React, { PureComponent } from "react";
import { Layout, Button, Select } from "antd";
import styled from "styled-components";
import SearchBox from "../components/searchBar";
import { Query } from "react-apollo";
import { getDataQuery } from "../lib/queries";
import { select, s } from "../lib/store";
import { get } from "lodash";
import ErrorBoundary from "../components/ErrorBoundary";
const { Option } = Select;

const Content = styled(Layout.Header)`
    ${() => ""};
    background-color: white !important;
    box-shadow: 0px 3px 14px #edeef4;
    height: 50px;
    z-index: 10;
    display: flex;
    align-items: center;
    line-height: 30px !important;
    height: 50px !important;
    & rect,
    line,
    text {
        transition: all 1s;
    }
`;

const LeftSide = styled.div``;
const RightSide = styled.div`
    text-align: right;
    flex: 1;
    display: flex;
    justify-content: flex-end;
`;

class Status extends PureComponent {
    render() {
        const {
            loading,
            data: { Corpus, Coverage = 0, NoSpecialCoverage = 0 }
        } = this.props;
        const barWidth = 150;
        let coverageProportion = Coverage / Corpus;
        let coverageNoSpecialProportion = NoSpecialCoverage / Corpus;
        let coveragePos = coverageProportion * barWidth;
        let coveragePosNospecial = coverageNoSpecialProportion * barWidth;
        return (
            <div
                style={{
                    lineHeight: "20px",
                    display: "flex",
                    alignItems: "center",
                    marginRight: "20px"
                }}>
                <div
                    style={{
                        marginRight: "5px",
                        paddingTop: "5px"
                    }}>
                    Coverage:
                </div>
                <svg height="35px" width="200px" style={{}}>
                    <g style={{ transform: "translate(2px,12px)" }}>
                        <text
                            dx={0}
                            dy="-2px"
                            transform={`translate(${coveragePosNospecial},0)`}
                            style={{ fontSize: "12px" }}>
                            {NoSpecialCoverage}
                        </text>
                        <rect
                            width={barWidth}
                            style={{ transition: "all 2s" }}
                            height="15"
                            fill="#ddd"
                        />
                        <rect
                            width={coveragePos}
                            height="15"
                            fill="red"
                            opacity="0.4"
                        />
                        <rect
                            width={coveragePosNospecial}
                            height="15"
                            fill="#4886FD"
                            opacity="1"
                        />
                        <line
                            transform={`translate(${coveragePosNospecial},0)`}
                            x1={0}
                            x2={0}
                            y1="-3px"
                            y2="19px"
                            stroke="#aaa"
                        />
                        <text dx="155px" dy="13" style={{ fontSize: "12px" }}>
                            {Corpus}
                        </text>
                    </g>
                    {loading && (
                        <g>
                            <rect
                                width="200"
                                height="35"
                                fill="white"
                                style={{ opacity: 0.5, transition: "all 1s" }}
                            />
                        </g>
                    )}
                </svg>
            </div>
        );
    }
}

class Controls extends PureComponent {
    render() {
        const { hasFilter, setFilter, labelSet } = this.props;
        return (
            <Button.Group>
                <Button
                    icon="close"
                    disabled={!hasFilter}
                    onClick={() => setFilter()}>
                    Clear Filters
                </Button>
                <Button
                    icon="plus"
                    onClick={() => {
                        let name = prompt("name");
                        this.props.addLabel(name, null, "SystemBarButton");
                    }}>
                    Add Label
                </Button>
                <Button
                    icon="save"
                    onClick={() => {
                        var data = labelSet;
                        var json = JSON.stringify(data, null, 4);
                        var blob = new Blob([json], {
                            type: "application/json"
                        });
                        var url = URL.createObjectURL(blob);

                        var a = document.createElement("a");
                        let name = `${prompt("Name", "Labels")}.json`;
                        a.download = name;
                        a.href = url;
                        a.textContent = name;
                        a.click();
                    }}>
                    Save
                </Button>
            </Button.Group>
        );
    }
}

class SystemBarView extends PureComponent {
    addKeyword = keyword => {
        this.props.searchAddKeyword(keyword, "SearchBox");
    };
    removeKeyword = keyword => {
        this.props.searchRemoveKeyword(keyword);
    };

    render() {
        const {
            datasetId,
            datasetSize,
            labelSetLabels,
            filter,
            filterSearch,
            fields,
            textField,
            addLabel,
            labelsNoSpecial,
            hasFilter,
            setFilter,
            labelSet
        } = this.props;

        return (
            <ErrorBoundary>
                <Query
                    query={getDataQuery}
                    variables={{
                        ID: datasetId,
                        filter,
                        noSpecialFilter: labelsNoSpecial
                    }}>
                    {result => {
                        let Coverage =
                            labelSetLabels && labelSetLabels.length > 0
                                ? get(result.data, "Dataset.Select.Size")
                                : 0;
                        let NoSpecialCoverage =
                            labelSetLabels && labelSetLabels.length > 0
                                ? get(result.data, "Dataset.NoSpecial.Size")
                                : 0;
                        return (
                            <Content>
                                <LeftSide style={{ lineHeight: "10px" }}>
                                    <SearchBox
                                        filters={filterSearch}
                                        onAdd={this.addKeyword}
                                        onRemove={this.removeKeyword}
                                    />
                                </LeftSide>
                                <RightSide>
                                    <Status
                                        loading={result.loading}
                                        data={{
                                            Corpus: datasetSize,
                                            Coverage: Coverage,
                                            NoSpecialCoverage
                                        }}
                                    />

                                    <Select
                                        style={{
                                            width: "200px",
                                            marginRight: "10px"
                                        }}
                                        value={textField.ID}
                                        onChange={value =>
                                            this.props.setTextField(
                                                fields.find(f => f.ID === value)
                                            )
                                        }>
                                        {fields
                                            .filter(s => s.Type === "TEXT")
                                            .map(s => (
                                                <Option key={s.ID} value={s.ID}>
                                                    {s.Name}
                                                </Option>
                                            ))}
                                    </Select>

                                    <Controls
                                        labelSet={labelSet}
                                        addLabel={addLabel}
                                        hasFilter={hasFilter}
                                        setFilter={setFilter}
                                    />
                                </RightSide>
                            </Content>
                        );
                    }}
                </Query>
            </ErrorBoundary>
        );
    }
}

export default select(
    [
        "dataset.ID",
        "datasetSize:dataset.Info.Size",
        "labelSet",
        "labelSet.Labels",
        "filter.search",
        "fields: dataset.Schema.Fields",
        "textField: dataset.textField",
        s.filter("SystemBarView", {
            components: ["labels"],
            join: { ALL: [], ANY: ["anyLabel"], NOT: [] }
        }),
        s.filter("SystemBarView", {
            components: ["labelsNoSpecial"],
            alias: "labelsNoSpecial",
            join: { ALL: [], ANY: ["labelsNoSpecial"], NOT: [] }
        }),
        s.hasFilters()
    ],
    [
        "searchAddKeyword",
        "searchRemoveKeyword",
        "setTextField",
        "addLabel",
        "setFilter"
    ]
)(SystemBarView);
