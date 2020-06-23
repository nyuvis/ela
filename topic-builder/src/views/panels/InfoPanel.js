import React, { PureComponent } from "react";
import JoinSelection from "../../components/JoinSelector";
import { Query } from "react-apollo";
import { getInfoDataquery } from "../../lib/queries";
import { s, select } from "../../lib/store";
import KeywordSummary from "../../components/KeywordSummary";
import { get } from "lodash";
import styled from "styled-components";
import DocumentList, { CheckedMenutItem } from "../../components/DocumentsList";
import { Menu, Dropdown, Icon } from "antd";
import ErrorBoundary from "../../components/ErrorBoundary";

const KEYWORD_SUMMARY = "Dataset.Select.Values";
const DATA_SIZE = "Dataset.Select.Size";
const DOCUMENTS = "Dataset.Documents.Documents";

const KeywordsContainer = styled.div`
    ${() => ""};
    background-color: white;

    padding: 10px;
    border-bottom: solid 1px #ddd;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`;

class InfoPanel extends PureComponent {
    constructor() {
        super();
        this.state = {
            sortBy: "DESC",
            from: 0,
            discriminant: true,
            selectedKeywords: []
        };
    }
    componentDidCatch(error, info) {
        this.setState({ hasError: true });
        console.eror(error, info);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.filter !== nextProps.filter) {
            this.setState({
                selectedKeywords: []
            });
        }
    }

    render() {
        const {
            datasetId,
            textField,
            filter,
            keywordsUsed = [],
            ignoredKeywords = []
        } = this.props;
        const { sortBy, from, showField, discriminant } = this.state;
        let filterDocuments;
        if (this.state.selectedKeywords.length) {
            filterDocuments = filterDocuments || [];
            filterDocuments.push({
                field: textField,
                query: this.state.selectedKeywords
            });
        }
        if (filter) {
            filterDocuments = filterDocuments || [];
            filterDocuments.push(filter);
        }
        if (filterDocuments && filterDocuments.length > 0) {
            filterDocuments = { and: filterDocuments };
        }
        let variables = {
            ID: datasetId,
            field: textField,
            showField: showField || textField,
            filter,
            filterDocuments: filterDocuments,
            from,
            sortBy,
            discriminant,
            exclude: [...keywordsUsed, ...ignoredKeywords]
        };

        const keywordMenu = (
            <Menu
                selectable
                onClick={e => {
                    this.setState({
                        discriminant: e.key === "true"
                    });
                }}>
                <CheckedMenutItem key="true" checked={discriminant === true}>
                    Show Discriminant
                </CheckedMenutItem>
                <CheckedMenutItem key="false" checked={discriminant === false}>
                    Show Frequent
                </CheckedMenutItem>
            </Menu>
        );

        let keywordDrpDwn = (
            <Dropdown overlay={keywordMenu} key={"keywordDrpDwn"}>
                <div style={{ cursor: "pointer" }}>
                    {discriminant ? "Discriminant " : "Frequent "}
                    <Icon
                        type="setting"
                        style={{ fontSize: "16px", margin: "0px 2px" }}
                    />
                </div>
            </Dropdown>
        );

        return (
            <Container>
                <JoinSelection />
                <Query query={getInfoDataquery} variables={variables}>
                    {({ data }) => {
                        if (!data) {
                            data = this.dataCache;
                        } else {
                            this.dataCache = data;
                        }
                        return [
                            <KeywordsContainer key="KeywordSummary">
                                <div style={{ display: "flex" }}>
                                    Keywords
                                    <div
                                        style={{ textAlign: "right", flex: 1 }}>
                                        {keywordDrpDwn}
                                    </div>
                                </div>
                                <ErrorBoundary
                                    onError={
                                        <KeywordSummary
                                            width={380}
                                            height={220}
                                        />
                                    }>
                                    <KeywordSummary
                                        width={380}
                                        height={220}
                                        numColumns={2}
                                        numRows={10}
                                        selectedKeywords={
                                            this.state.selectedKeywords
                                        }
                                        onSelectionChange={newKeywords => {
                                            this.setState({
                                                selectedKeywords: newKeywords
                                            });
                                        }}
                                        data={get(data, KEYWORD_SUMMARY)}
                                    />
                                </ErrorBoundary>
                            </KeywordsContainer>,
                            <DocumentList
                                key="DocumentList"
                                data={get(data, DOCUMENTS)}
                                size={get(data, DATA_SIZE)}
                                sortBy={sortBy}
                                from={this.state.from}
                                showField={this.state.showField || textField}
                                setShowField={field =>
                                    this.setState({ showField: field })
                                }
                                setSortBy={sort =>
                                    this.setState({ sortBy: sort })
                                }
                                setPage={page => {
                                    this.setState({ from: page * 100 - 1 });
                                }}
                            />
                        ];
                    }}
                </Query>
            </Container>
        );
    }
}

export default select([
    s.datasetID,
    s.textField,
    s.filter("InfoPanel", {}),
    s.keywordsUsed,
    "ignoredKeywords"
])(InfoPanel);
