import React, { PureComponent } from "react";
import { getLDASeedsQuery } from "../../lib/queries";
import { s, select } from "../../lib/store";
import { Query } from "react-apollo";
import { get } from "lodash";
import KeywordSet from "../../components/keywordSets";
const KEYWORD_SET = ["Dataset", "Select", "NLP", "KeywordTopics"];

class LDAPanel extends PureComponent {
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
            <Query query={getLDASeedsQuery} variables={variables}>
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
                            <KeywordSet
                                ID="LDA"
                                data={keywordSetData.slice(0, 50)}
                            />
                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default select([s.datasetID, s.textField])(LDAPanel);

/* <div style={{ flex: 1, overflow: "auto" }}>

</div> */
