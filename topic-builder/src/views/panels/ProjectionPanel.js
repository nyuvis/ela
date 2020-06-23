import React, { PureComponent } from "react";
import { projectionPanelQuery } from "../../lib/queries";
import { Query } from "react-apollo";
import Histogram2D from "../../components/Histogram2D";
import { get } from "lodash";
import { select, s } from "../../lib/store";
import KeywordSet from "../../components/keywordSets";

class ProjectionPanel extends PureComponent {
    constructor() {
        super();
        this.state = {
            ignoredTopics: new Set(),
            params: {
                projectioField: "projection_point",
                threshold: 0.8,
                num_topics: 30,
                binsX: 50,
                binsY: 50,
                num_keywords: 10
            }
        };
    }
    render() {
        const { datasetId, textField, filter, filterSuggestions } = this.props;
        const { params, ignoredTopics } = this.state;
        let variables = {
            filter: filter,
            filterSuggestions,
            ID: datasetId,
            field: textField,
            featureX: "projection_point.x",
            featureY: "projection_point.y",
            binsX: params.binsX,
            binsY: params.binsY,
            params
        };
        return (
            <Query query={projectionPanelQuery} variables={variables}>
                {({ data, loading }) => {
                    let dataKeywordSet = get(data, [
                        "Dataset",
                        "Suggestions",
                        "NLP",
                        "TopicModel"
                    ]);
                    if (!dataKeywordSet) return <div />;

                    dataKeywordSet = dataKeywordSet.filter(
                        f => !ignoredTopics.has(f.Topic)
                    );
                    return (
                        <div
                            style={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column"
                            }}>
                            <Histogram2D
                                data={get(data, [
                                    "Dataset",
                                    "Histogram",
                                    "Histogram2D"
                                ])}
                                xStats={get(data, [
                                    "Dataset",
                                    "Stats",
                                    "StatsX"
                                ])}
                                yStats={get(data, [
                                    "Dataset",
                                    "Stats",
                                    "StatsY"
                                ])}
                                binsX={params.binsX}
                                binsY={params.binsY}
                                loading={loading}
                                width={300}
                                height={300}
                                datasetId={datasetId}
                            />
                            <KeywordSet
                                ID="Projection"
                                data={dataKeywordSet}
                                ignore={topic => {
                                    this.setState({
                                        ignoredTopics: new Set(
                                            ignoredTopics
                                        ).add(topic.Topic)
                                    });
                                }}
                            />
                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default select([
    s.datasetID,
    s.textField,
    s.filter("ProjectionPanel", { ignore: ["projection"] }),
    s.filter("ProjectionPanel", {
        ignore: ["projection", "selectedSuggestion"],
        alias: "filterSuggestions"
    })
])(ProjectionPanel);
