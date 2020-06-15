import React, { Component } from "react";
import { Modal, Spin } from "antd";
import styled from "styled-components";
import Linkify from "react-linkify";
import { isArray, isPlainObject } from "lodash";
import { parseTags } from "./Document";
import { select, s } from "../lib/store";
import { Query } from "react-apollo";
import { getDocumentQuery } from "../lib/queries";
import DocumentComponent from "./Document";

const Field = styled.div`
    display: flex;
    margin-bottom: 10px;

    & .document-field-detail {
        display: block;
        border-bottom: solid 1px #ccc;
        overflow: auto;
        flex: 1;
        padding: 5px;
        max-height: 250px;
    }

    & label {
        width: 120px;
        padding: 5px;
        text-align: right;
        font-weight: bold;
    }
`;

const NullValue = styled.span`
    background-color: #ccc;
    color: white;
    padding: 2px 5px;
    box-radius: 3px;
`;

const Link = props => {
    const { children, ...rest } = props;
    return (
        <a {...rest} target="_blank">
            {children}
        </a>
    );
};

export class DocumentsList extends Component {
    constructor() {
        super();
        this.state = {};
    }
    renderFieldValue(field, value) {
        if (!value) return <NullValue />;
        let isArr = isArray(value);
        let isObj = isPlainObject(value);
        if (isObj) {
            return <span />;
        }
        switch (field.Type) {
            case "DATE":
                return <span>{new Date(value).toLocaleString()}</span>;

            case "TEXT":
                return (
                    <Linkify target="_blank" po={12} component={Link}>
                        {isArr
                            ? value.map((v, idx) => (
                                  <div
                                      key={idx}
                                      style={{
                                          borderBottom: "solid 1px #ccc",
                                          padding: "10px 0px"
                                      }}>
                                      {v
                                          .split("/\n/")
                                          .map((t, id) => (
                                              <div key={id}>{t}</div>
                                          ))}
                                  </div>
                              ))
                            : value
                                  .split("/\n/")
                                  .map((t, id) => <div key={id}>{t}</div>)}
                    </Linkify>
                );
            case "CATEGORICAL":
                return (
                    <Linkify target="_blank" po={12} component={Link}>
                        {isArr
                            ? value
                                  .map(
                                      v =>
                                          v.replace ? v.replace(/\\n/g, "") : v
                                  )
                                  .join(" ,")
                            : value.replace ? value.replace(/\\n/g, "") : value}
                    </Linkify>
                );

            default:
                return <span>{value}</span>;
        }
    }
    renderMain(data) {
        const { docID, fields } = this.props;

        if (!data || !docID) return null;
        const { Document, DocumentHighlight, SimilarDocuments = [] } = data;

        let Text =
            DocumentHighlight && DocumentHighlight[0]
                ? DocumentHighlight[0].Text || ""
                : "";

        return (
            <div style={{ display: "flex" }}>
                <div style={{ flex: 1 }}>
                    <div style={{ borderBottom: "solid 1px #ccc" }}>
                        <pre style={{ whiteSpace: "pre-wrap" }}>
                            {isArray(Text)
                                ? Text.map((t, idx) => (
                                      <div key={idx}>{parseTags(t, idx)}</div>
                                  ))
                                : Text.replace(/\\n/g, "")}
                        </pre>
                    </div>
                    {fields.filter(field => Document[field.ID]).map(field => (
                        <Field key={field.ID}>
                            <label>{field.Name}</label>
                            <span className="document-field-detail">
                                {this.renderFieldValue(
                                    field,
                                    Document[field.ID]
                                )}
                            </span>
                        </Field>
                    ))}
                </div>
                {SimilarDocuments &&
                    SimilarDocuments.length > 0 && (
                        <div
                            style={{
                                width: "350px",
                                overflow: "auto",
                                borderLeft: "solid 1px #ccc",
                                marginLeft: "30px"
                            }}>
                            <div style={{ paddingLeft: "20px" }}>
                                <b>Similar Documents</b>
                            </div>
                            {SimilarDocuments.map((d, pos) => (
                                <DocumentComponent
                                    pos={pos}
                                    showDetails={() =>
                                        this.setState({
                                            docID: d.ID
                                        })
                                    }
                                    document={d}
                                    key={d.ID}
                                />
                            ))}
                        </div>
                    )}
            </div>
        );
    }
    render() {
        const {
            docID,
            modal,
            onCancel,
            fields,
            datasetId,
            textField,
            highlight
        } = this.props;

        if (!fields) return null;
        let variables = {
            ID: datasetId,
            textField,
            docID: this.state.docID || docID,
            docIDStr: [this.state.docID || docID],
            highlight
        };

        if (modal) {
            return (
                <Modal
                    visible={!!docID}
                    footer={false}
                    width="auto"
                    style={{
                        margin: "40px"
                    }}
                    onCancel={() => {
                        this.setState({ docID: null });
                        onCancel();
                    }}
                    title={`Document: ${docID}`}>
                    {docID && (
                        <Query query={getDocumentQuery} variables={variables}>
                            {({ data }) => {
                                if (!data || !data.Dataset)
                                    return (
                                        <div style={{ textAlign: "center" }}>
                                            <Spin />
                                        </div>
                                    );
                                const Document = data.Dataset.Document.Raw;
                                const DocumentHighlight =
                                    data.Dataset.Select.Documents;
                                const SimilarDocuments =
                                    data.Dataset.Similar.Documents;
                                return this.renderMain({
                                    Document,
                                    DocumentHighlight,
                                    SimilarDocuments
                                });
                            }}
                        </Query>
                    )}
                </Modal>
            );
        } else {
            return this.renderMain();
        }
    }
}

export default select([
    "fields:dataset.Schema.Fields",
    s.datasetID,
    s.textField,
    s.highlight
])(DocumentsList);
