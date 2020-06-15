import React, { PureComponent } from "react";
import { Dropdown } from "antd";
import { Menu } from "antd";
import MoreIcon from "react-icons/lib/fa/angle-down";
import DeleteIcon from "react-icons/lib/md/delete";
import AddIcon from "react-icons/lib/fa/plus";
import styled from "styled-components";
import FAExpandIcon from "react-icons/lib/fa/expand";
import FACompressIcon from "react-icons/lib/fa/compress";

const TopicName = styled.input`
    font-size: ${({ theme }) => theme.sizes.fontTopicHeader}em;
    color: ${({ theme, topicMenuVisible, disabled }) =>
        disabled ? "#999" : null};
    width: ${({ expanded }) => (expanded ? 400 : 200)}px;
    margin-bottom: 10px;
    position: relative;
    border: none;
    outline: none;
    background-color: transparent;
    &:hover {
        border-bottom: solid 1px ${({ theme }) => theme.colors.border};
    }
    &:focus {
        border-bottom: solid 1px ${({ theme }) => theme.colors.primary};
    }
`;

const ThresholdInput = styled.input`
    width: 3em;
    border: none;
    outline: none;
    text-align: center;
    &:focus {
        border-bottom: solid 1px ${({ theme }) => theme.colors.border};
    }
`;

const TopicInfo = styled.div`
    position: absolute;
    right: 20px;
    top: 0px;
    display: flex;
    textalign: center;
`;

const TopicInfoLabel = styled.div`
    font-size: 0.7em;
    padding: 0px 5px;
`;

const ExpandIcon = styled.div`
    position: absolute;
    right: 0px;
    opacity: 0.5;
    cursor: pointer;
    top: 0px;
    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`;

const MenuValue = styled.div`
    display: flex;
    align-items: center;
`;

export default class TopicCardHeader extends PureComponent {
    render() {
        const {
            data,
            isMenuVisible,
            exclusive,
            count,
            removeLabel,
            addRule,
            setLabelSetName,
            setLabelTreshold,
            setLabelSetExpanded,
            setMenuVisible
        } = this.props;

        let topic = data;
        let topicMenuVisible = isMenuVisible;
        const setTopicTreshold = setLabelTreshold;

        return (
            <div style={{ position: "relative" }}>
                <Dropdown
                    onClick={e => e.stopPropagation()}
                    overlay={
                        <Menu>
                            <Menu.Item>
                                <MenuValue
                                    onClick={e => {
                                        setMenuVisible("header", false);
                                        addRule();
                                    }}>
                                    <AddIcon />{" "}
                                    <label style={{ paddingLeft: "5px" }}>
                                        Add Keyword
                                    </label>
                                </MenuValue>
                            </Menu.Item>
                            <Menu.Item>
                                <MenuValue
                                    onClick={e => {
                                        setMenuVisible("header", false);
                                        removeLabel(data.ID);
                                    }}>
                                    <DeleteIcon />
                                    <label style={{ paddingLeft: "5px" }}>
                                        Remove Label
                                    </label>
                                </MenuValue>
                            </Menu.Item>
                        </Menu>
                    }
                    onVisibleChange={visible =>
                        setMenuVisible("header", visible)
                    }
                    trigger={["click"]}>
                    <MoreIcon
                        onClick={e => {
                            e.stopPropagation();
                        }}
                        style={{
                            fontSize: "1.4em",
                            position: "relative",
                            top: "-2px"
                        }}
                    />
                </Dropdown>
                <TopicName
                    expanded={data.expanded}
                    topicMenuVisible={topicMenuVisible}
                    defaultValue={data.Name}
                    disabled={!!data.TYPE}
                    onClick={e => {
                        e.stopPropagation();
                    }}
                    onBlur={e => {
                        setLabelSetName(data.ID, e.target.value, "CardHeader");
                    }}
                />
                <TopicInfo>
                    {setTopicTreshold && (
                        <div>
                            <TopicInfoLabel>Trehsold</TopicInfoLabel>
                            <div>
                                <ThresholdInput
                                    type="number"
                                    step="0.1"
                                    value={data.Threshold}
                                    onChange={e => {
                                        setTopicTreshold(
                                            topic.ID,
                                            e.target.value
                                        );
                                    }}
                                    min="0"
                                    max="1"
                                />
                            </div>
                        </div>
                    )}
                    <div>
                        <TopicInfoLabel>Documents</TopicInfoLabel>
                        <div style={{ textAlign: "center" }}>{count}</div>
                    </div>
                    <div>
                        <TopicInfoLabel>Exclusive</TopicInfoLabel>
                        <div style={{ textAlign: "center" }}>
                            {(exclusive * 100).toFixed(0)}%
                        </div>
                    </div>
                </TopicInfo>
                <ExpandIcon key={"ExpandIcon"}>
                    {!topic.expanded ? (
                        <FAExpandIcon
                            onClick={e => {
                                e.stopPropagation();
                                setLabelSetExpanded(data.ID, true);
                            }}
                        />
                    ) : (
                        <FACompressIcon
                            onClick={e => {
                                e.stopPropagation();
                                setLabelSetExpanded(data.ID, false);
                            }}
                        />
                    )}
                </ExpandIcon>
            </div>
        );
    }
}
