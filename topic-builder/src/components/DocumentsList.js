import React, { PureComponent } from "react";
import { Pagination, Menu, Dropdown, Icon } from "antd";
import styled from "styled-components";
import { select, s } from "../lib/store";
import Document from "./Document";
import DocumentDetail from "./DocumentDetail";
const MenuIcon = styled.span`
    display: inline-block;
    width: 25px;
`;

const iconsMap = {
    ASC: "arrow-down",
    DESC: "arrow-up",
    RANDOM: "question-circle-o"
};

export class CheckedMenutItem extends PureComponent {
    render() {
        const { checked, children, ...props } = this.props;
        return (
            <Menu.Item {...props}>
                <MenuIcon>{checked ? <Icon type="check" /> : ""}</MenuIcon>
                {children}
            </Menu.Item>
        );
    }
}

class DocumentList extends PureComponent {
    constructor(props) {
        super();
        this.state = {
            showDocument: null
        };
    }

    showDetails = ID => {
        this.setState({ showDocument: ID });
    };
    hideDocumentDetails = () => {
        this.setState({ showDocument: null });
    };

    renderHeader() {
        const { textField, dataFields, size, sortBy, showField } = this.props;

        const menu = (
            <Menu
                selectable
                onClick={e => {
                    this.props.setSortBy(e.key);
                }}>
                <CheckedMenutItem key="DESC" checked={sortBy === "DESC"}>
                    Score: Desc
                </CheckedMenutItem>
                <CheckedMenutItem key="ASC" checked={sortBy === "ASC"}>
                    Score: Asc
                </CheckedMenutItem>
                <CheckedMenutItem key="RANDOM" checked={sortBy === "RANDOM"}>
                    Random
                </CheckedMenutItem>
            </Menu>
        );

        const fields = (
            <Menu
                onClick={sel => {
                    this.props.setShowField(sel.key);
                }}>
                {dataFields.filter(f => f.Type === "TEXT").map(field => (
                    <CheckedMenutItem
                        key={field.ID}
                        checked={showField === field.ID}>
                        {textField === field.ID ? (
                            <b>{field.Name}</b>
                        ) : (
                            field.Name
                        )}
                    </CheckedMenutItem>
                ))}
            </Menu>
        );
        let sortByDrpDwn = (
            <Dropdown overlay={menu} key={"sortByDrpDwn"}>
                <Icon
                    type={iconsMap[sortBy]}
                    style={{ fontSize: "16px", margin: "0px 2px" }}
                />
            </Dropdown>
        );
        let fieldsDrpDwn = (
            <Dropdown overlay={fields} key={"fieldsDrpDwn"}>
                <Icon
                    type="table"
                    style={{
                        fontSize: "16px",
                        margin: "0px 2px",
                        color: showField !== textField && "red"
                    }}
                />
            </Dropdown>
        );

        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    marginBottom: "5px",
                    marginTop: "-10px"
                }}>
                <div
                    style={{
                        padding: "15px 20px 0px 15px",
                        fontSize: "16px",
                        display: "flex",
                        minHeight: "40px"
                    }}>
                    <div>
                        Documents: <b style={{ fontWeight: "bold" }}>{size}</b>
                    </div>
                    <div
                        style={{
                            flexBasis: "end",
                            flex: "1",
                            textAlign: "right"
                        }}>
                        {[sortByDrpDwn, fieldsDrpDwn]}
                    </div>
                </div>
            </div>
        );
    }

    renderDocuments() {
        let { data = [] } = this.props;
        data = data || [];
        return (
            <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
                {data.map((d, pos) => (
                    <Document
                        pos={pos}
                        showDetails={this.showDetails}
                        document={d}
                        key={d.ID}
                    />
                ))}
            </div>
        );
    }

    render() {
        const { size, from = 0 } = this.props;
        return (
            <div
                style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column"
                }}>
                {this.renderHeader()}
                {this.renderDocuments()}
                <div style={{ textAlign: "center" }}>
                    <Pagination
                        size="small"
                        total={size}
                        pageSize={100}
                        onChange={this.props.setPage}
                        current={Math.floor(from / 100) + 1}
                    />
                </div>
                <div style={{ height: "60px" }} />
                <DocumentDetail
                    onCancel={this.hideDocumentDetails}
                    modal={true}
                    key={"DocumentDetail"}
                    docID={this.state.showDocument}
                />
            </div>
        );
    }
}

export default select(["dataFields:dataset.Schema.Fields", s.textField])(
    DocumentList
);
