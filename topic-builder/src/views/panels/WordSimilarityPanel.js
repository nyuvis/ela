import React, { PureComponent } from "react";
import { InputNumber } from "antd";
import { getWordSimilaritySeedsQuery } from "../../lib/queries";
import { s, select } from "../../lib/store";
import { Query } from "react-apollo";
import { get } from "lodash";
import KeywordSet from "../../components/keywordSets";
const KEYWORD_SET = ["Dataset", "Select", "NLP", "KeywordTopics"];

class WordSimilarityPanel extends PureComponent {
    constructor() {
        super();
        this.state = {
            params: {
                threshold: 0.7,
                max_words: 10,
                keyword_samples: 1000
            }
        };
    }
    changeThreshold = threshold => {
        let params = { ...this.state.params, threshold };
        this.setState({
            params
        });
    };
    render() {
        //let keywordSetData = get(data, KEYWORD_SET);
        const { datasetId, textField } = this.props;
        let variables = {
            ID: datasetId,
            field: textField,
            params: this.state.params
        };

        return (
            <Query query={getWordSimilaritySeedsQuery} variables={variables}>
                {({ data }) => {
                    let keywordSetData = get(data, KEYWORD_SET) || [];
                    return (
                        <div
                            style={{
                                borderTop: "solid 1px #ccc",
                                marginTop: "10px",
                                flex: 1,
                                display: "flex",
                                flexDirection: "column"
                            }}>
                            <div
                                style={{
                                    margin: "10px 20px",
                                    padding: "10px",
                                    borderBottom: "solid 1px #ccc"
                                }}>
                                <span>Group words with similarity:</span>
                                <InputNumber
                                    min={0.1}
                                    max={1}
                                    step={0.1}
                                    style={{ marginLeft: 8 }}
                                    value={this.state.params.threshold}
                                    onChange={this.changeThreshold}
                                />
                            </div>
                            <KeywordSet
                                ID="Word Similarity"
                                data={keywordSetData.slice(0, 50)}
                            />
                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default select([s.datasetID, s.textField])(WordSimilarityPanel);

/* <div style={{ flex: 1, overflow: "auto" }}>

</div> */
