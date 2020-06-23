import React, { PureComponent } from "react";
import styled from "styled-components";
import DeleteIcon from "react-icons/lib/md/delete";
import EditIcon from "react-icons/lib/md/mode-edit";
import MdBlock from "react-icons/lib/md/block";
import MdCheck from "react-icons/lib/md/check";

import { Dropdown } from "antd";
import { Menu } from "antd";

import theme from "../lib/theme";

const Container = styled.div`
    ${() => ""};
    margin: 3px;
    padding: 3px 10px;
    border-radius: 5px;
    cursor: pointer;
    white-space: nowrap;
`;

const MenuValue = styled.div`
    display: flex;
    align-items: center;
`;

class Rule extends PureComponent {
    constructor() {
        super();
        this.state = {
            menuVisible: false
        };
    }
    render() {
        const { remove, rule, changeType, editRule } = this.props;
        let baseColor = rule.type === "NEGATIVE" ? "#d55" : "";
        let menuColor = rule.type === "NEGATIVE" ? "#d55" : theme.colors.primary;
        const menu = (
            <Menu>
                <Menu.Item>
                    <MenuValue
                        onClick={e => {
                            e.stopPropagation();
                            editRule(rule);
                        }}>
                        <EditIcon style={{ margin: "0px 5px" }} />
                        <label>Edit Rule</label>
                    </MenuValue>
                </Menu.Item>
                <Menu.Item>
                    <MenuValue
                        onClick={e => {
                            e.stopPropagation();
                            changeType(
                                this.props.children,
                                rule.type === "POSITIVE" ? "NEGATIVE" : "POSITIVE"
                            );
                        }}>
                        {rule.type === "POSITIVE" ? (
                            <MdBlock style={{ margin: "0px 5px" }} />
                        ) : (
                            <MdCheck style={{ margin: "0px 5px" }} />
                        )}
                        <label>
                            Set it as {rule.type === "POSITIVE" ? "Negative" : "Positive"}
                        </label>
                    </MenuValue>
                </Menu.Item>
                <Menu.Item>
                    <MenuValue
                        onClick={e => {
                            e.stopPropagation();
                            remove(this.props.children);
                        }}>
                        <DeleteIcon style={{ margin: "0px 5px" }} />
                        <label>Remove Rule</label>
                    </MenuValue>
                </Menu.Item>
            </Menu>
        );
        return (
            <Dropdown
                overlay={menu}
                placement="bottomLeft"
                onClick={e => {
                    e.stopPropagation();
                }}
                onVisibleChange={visibility =>
                    this.setState({
                        menuVisible: visibility
                    })
                }>
                <Container
                    className="rule"
                    style={{
                        color: this.state.menuVisible ? menuColor : baseColor,
                        backgroundColor: this.state.menuVisible ? "#eee" : null
                    }}>
                    {this.props.children}
                </Container>
            </Dropdown>
        );
    }
}

export default Rule;

// <Dropdown
//                 onClick={e => e.stopPropagation()}
//                 overlay={
//                     <Menu>
//                         <MenuItem
//                             onClick={e => {
//                                 e.stopPropagation();
//                                 remove(this.props.children);
//                             }}>
//
//                         </MenuItem>
//                         <Divider />
//                         <MenuItem
//                             onClick={e => {
//                                 e.stopPropagation();
//                             }}>
//                             <AddIcon /> <label>Show Matching Documents</label>
//                         </MenuItem>
//                     </Menu>
//                 }
//                 trigger={["click"]}>
//
//             </Dropdown>
