import React, { PureComponent } from "react";
import styled from "styled-components";
import CardGrid from "../components/CardGrid";
import RuleListLabelCard from "../components/RuleListLabelCard";
import { select, s } from "../lib/store";
import { Query } from "react-apollo";
import { labelSetStatusQuery } from "../lib/queries";
import { get } from "lodash";
import { arrayToMap } from "../lib/utils";
import { DropTarget } from "react-dnd";
import { compileLabelFilter } from "../lib/reducers/filter";
import { Modal, Input } from "antd";
import ErrorBoundary from "../components/ErrorBoundary";

const ContainerStyle = {
    flex: 1,
    position: "relative",
    height: "100%",
    overflowY: "auto",
    overflowX: "hidden"
};
const overStyle = (canDrop, isOver) => ({
    display: canDrop ? "block" : "none",
    position: "absolute",
    top: "0px",
    left: "0px",
    bottom: "0px",
    right: "0px",
    textAlign: "center",
    border: "dashed 1px #999",
    fontSize: "1.5em",
    paddingTop: "40px",
    zIndex: 100,
    transition: "background-color 0.5s ease",
    backgroundColor: `rgba(255,255,255,${isOver ? "1" : "0.5"})`
});
const StartMenu = styled.div`
    position: absolute;
    text-align: center;
    width: 300px;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const MenuItem = styled.div`
    box-shadow: 0px 5px 10px #ccc;
    background-color: white;
    font-size: 1.3em;
    margin: 20px;
    padding: ${({ theme }) => theme.sizes.padding}px;
    cursor: pointer;
    transition: box-shadow 0.1s ease-out, background-color 0.1s ease-out;
    &:hover {
        background-color: ${({ theme }) => theme.colors.primary};
        color: white;
        box-shadow: 0px 5px 20px #ccc;
    }
`;

const Title = styled.div`
    font-size: ${({ theme }) => theme.sizes.fontTitle}em;
    padding-bottom: ${({ theme }) => theme.sizes.padding}px;
`;

class SpecificationView extends PureComponent {
    renderClear() {
        const { isOver, canDrop, addLabel, connectDropTarget } = this.props;

        return connectDropTarget(
            <div style={ContainerStyle}>
                <div style={overStyle(canDrop, isOver)}>
                    Drop it to create a topic
                </div>
                <StartMenu>
                    <Title>Get Started</Title>
                    <MenuItem
                        onClick={() => {
                            addLabel(prompt("Name"), null, "HomeScreenButton");
                        }}>
                        Add New Label
                    </MenuItem>
                </StartMenu>
            </div>
        );
    }
    compileFilters() {
        const { labelSetLabels = [], textField } = this.props;
        let filters = labelSetLabels.map(l => ({
            Key: l.ID,
            Filter: compileLabelFilter(l, { textField })
        }));
        let Others = filters
            .map(f => {
                return {
                    Key: `ALL-${f.Key}`,
                    Filter: {
                        or: filters
                            .filter(fo => fo.Key !== f.Key)
                            .map(f => f.Filter)
                    }
                };
            })
            .filter(f => f.Filter.or.length > 0);
        let coverage = {
            Key: `Coverage`,
            Filter: {
                or: filters.map(f => f.Filter)
            }
        };
        filters = filters.concat(Others).concat([coverage]);
        return filters;
    }
    getLabelInfo = (labelID, dataIndex) => {
        if (!dataIndex[labelID]) return { count: 0, exclusive: 0 };
        let count = dataIndex[labelID].Size;
        let others = get(dataIndex, [`ALL-${labelID}`, "Size"]) || 0;
        let coverage = dataIndex["Coverage"].Size;
        let exclusive = (coverage - others) / count;

        return { count: count, exclusive: exclusive };
    };
    render() {
        const {
            width,
            labelSetLabels = [],
            datasetId,
            connectDropTarget,
            canDrop,
            isOver,
            labelsSetSelection,
            selectedLabels
        } = this.props;
        const variables = {
            ID: datasetId,
            labelFilters: this.compileFilters()
        };

        return connectDropTarget(
            <div
                onClick={() => {
                    if (selectedLabels && selectedLabels.length > 0) {
                        labelsSetSelection([], null, true);
                    }
                }}
                style={{
                    backgroundColor:
                        canDrop && isOver
                            ? "#d7d8fd"
                            : canDrop ? "#e7e8fd" : "#f7f8fd",
                    width: "100%",
                    overflow: "auto",
                    flex: "1"
                }}>
                {labelSetLabels && labelSetLabels.length ? (
                    <ErrorBoundary>
                        <Query
                            query={labelSetStatusQuery}
                            variables={variables}>
                            {result => {
                                if (result) {
                                    this.dataCache = result;
                                } else {
                                    result = this.dataCache;
                                }
                                let data = get(result.data, [
                                    "Dataset",
                                    "Select",
                                    "LabelsStats"
                                ]);

                                let dataIndex = arrayToMap(
                                    data || [],
                                    d => d.Key
                                );

                                return (
                                    <CardGrid
                                        width={width}
                                        data={labelSetLabels}
                                        expandedSize="6">
                                        {(d, childProps) => (
                                            <RuleListLabelCard
                                                data={d}
                                                {...childProps}
                                                {...this.getLabelInfo(
                                                    d.ID,
                                                    dataIndex
                                                )}
                                                style={{
                                                    border: "solid 1px #000",
                                                    height: "100%"
                                                }}
                                            />
                                        )}
                                    </CardGrid>
                                );
                            }}
                        </Query>
                    </ErrorBoundary>
                ) : (
                    this.renderClear()
                )}
            </div>
        );
    }
}

export default select(
    [
        "labelSet.Labels",
        s.datasetID,
        s.textField,
        "selectedLabels:filter.selectedLabels",

        ({ layout }) => ({
            width:
                layout.windowWidth - layout.discoveryPanel - layout.detailsPanel
        })
    ],
    ["addLabel", "labelsSetSelection", "setSelectedSuggestion"]
)(
    DropTarget(
        ["SEED_SUGGESTION"],
        {
            drop: (props, monitor) => {
                console.log("Dropped");
                if (monitor.didDrop()) {
                    return;
                }
                const item = monitor.getItem();
                let name = "";
                Modal.info({
                    title: "Add Label",
                    content: (
                        <div>
                            Label Name:{" "}
                            <Input
                                onChange={e => {
                                    name = e.target.value;
                                }}
                            />
                        </div>
                    ),
                    onOk() {
                        let label = {
                            name: name,
                            Rules: item.topic.Keywords.map(k => ({
                                rule: k.Keyword,
                                type: "POSITIVE"
                            }))
                        };
                        props.addLabel(
                            label.name,
                            label.Rules,
                            `Suggestion ${item.source}`,
                            { usedSubset: item.usedSubset }
                        );
                    }
                });
            }
        },
        (connect, monitor) => ({
            connectDropTarget: connect.dropTarget(),
            isOver: monitor.isOver({ shallow: true }),
            canDrop: monitor.canDrop()
        })
    )(SpecificationView)
);
