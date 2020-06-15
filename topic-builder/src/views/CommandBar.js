import React, { PureComponent } from "react";
import styled from "styled-components";
import { AutoComplete, Input } from "antd";
import { select, s } from "../lib/store";
import { set } from "lodash";

const BackDrop = styled.div`
    display: ${({ visible }) => (visible ? "block" : "none")};
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background-color: rgba(255, 255, 255, 0.7);
    z-index: 1000;
    animation-name: example;
    animation-duration: 0.5s;
    @keyframes example {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;

const InputBox = styled.div`
    ${() => {}};
    margin: 80px auto;
    background-color: white;
    width: 400px;
    padding: 5px;
    border: solid 1px #999;
    box-shadow: 0px 0px 30px #ccc;
`;

class CommandBar extends PureComponent {
    constructor() {
        super();
        this.state = {
            visible: false,
            result: [],
            value: "",
            params: {}
        };
    }

    componentWillMount() {
        this.updateActions(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.updateActions(nextProps);
    }

    updateActions(props) {
        const { labels = [] } = props;
        this.actions = [
            {
                Title: "Add Rule",
                Action: {
                    type: "ADD_LABEL_SET_RULE"
                },
                Params: [
                    {
                        Title: "Label",
                        Key: "ID",
                        Options: labels.map(l => ({
                            Value: l.ID,
                            Title: l.Name
                        }))
                    },
                    {
                        Title: "Rule",
                        Type: "String",
                        Key: "rule.rule"
                    },
                    {
                        Title: "Rule Type",
                        Type: "String",
                        Key: "rule.type",
                        Options: [
                            {
                                Title: "Positive",
                                Value: "POSITIVE"
                            },
                            {
                                Title: "Negative",
                                Value: "NEGATIVE"
                            }
                        ]
                    }
                ]
            },
            {
                Title: "Search",
                Params: [
                    {
                        Title: "Keyword",
                        Type: "String",
                        Key: "keyword"
                    }
                ],
                Action: {
                    type: "SEARCH_ADD_KEYWORD"
                }
            },
            {
                Title: "Clear All Filters",
                Action: {
                    type: "SET_FILTER"
                }
            }
        ];
    }
    componentDidMount() {
        window.addEventListener("keypress", e => {
            if (e.ctrlKey && e.key === "p") {
                this.setState({ visible: true });
                this.input.focus();
            }
        });
    }

    handleSearch = value => {
        let result = [];

        if (!value) {
            if (this.state.currentAction) {
                let param = this.state.currentAction.Params[
                    this.state.currentParam
                ];

                if (param && param.Options) {
                    result = param.Options;
                } else {
                    result = [{ Title: value }];
                }
            } else {
                result = this.actions.slice(0, 10);
            }
        } else {
            if (this.state.currentAction) {
                let param = this.state.currentAction.Params[
                    this.state.currentParam
                ];

                if (param && param.Options) {
                    result = param.Options.filter(a =>
                        a.Title.toLowerCase().startsWith(value.toLowerCase())
                    );
                } else {
                    result = [{ Title: value }];
                }
            } else {
                result = this.actions
                    .filter(a =>
                        a.Title.toLowerCase().startsWith(value.toLowerCase())
                    )
                    .slice(0, 10);
            }
        }
        this.setState({ result, searchValue: value });
    };

    getDataSource = () => {
        const { result, searchValue = "" } = this.state;

        const children = result.map(action => {
            return (
                <AutoComplete.Option
                    key={action.Title}
                    value={action.Value || action.Title}>
                    {searchValue.length > 0 ? (
                        <span>
                            <b>
                                {action.Title.substring(0, searchValue.length)}
                            </b>
                            <span>
                                {action.Title.substring(searchValue.length)}
                            </span>
                        </span>
                    ) : (
                        action.Title
                    )}
                </AutoComplete.Option>
            );
        });
        return children;
    };

    exit() {
        this.setState({
            visible: false,
            result: [],
            value: "",
            currentAction: null,
            currentParam: null,
            searchValue: ""
        });
    }

    param() {
        if (this.state.currentAction && this.state.currentAction.Params) {
            return this.state.currentAction.Params[this.state.currentParam];
        }
    }

    render() {
        const { execute } = this.props;
        const { currentAction, currentParam } = this.state;

        let param = this.param();

        return (
            <BackDrop
                visible={this.state.visible}
                onClick={() => this.setState({ visible: false })}>
                <InputBox>
                    <AutoComplete
                        optionLabelProp="value"
                        style={{ width: "100%" }}
                        value={this.state.value}
                        dataSource={this.getDataSource()}
                        onSelect={actionTitle => {
                            let cAction = currentAction;
                            let selectedParam = currentParam;
                            let paramInfo = param;
                            setTimeout(() => {
                                if (!cAction) {
                                    let action = this.actions.find(
                                        a => a.Title === actionTitle
                                    );
                                    if (!action) {
                                        this.setState({ value: "" });
                                    }
                                    if (action.Params) {
                                        this.setState({
                                            currentAction: action,
                                            currentParam: 0,
                                            value: ""
                                        });
                                    } else {
                                        execute(action.Action);
                                        this.exit();
                                    }
                                } else {
                                    selectedParam += 1;
                                    let paramsTosent = {
                                        ...this.state.params
                                    };
                                    paramsTosent = set(
                                        paramsTosent,
                                        paramInfo.Key,
                                        actionTitle
                                    );
                                    if (
                                        currentAction.Params.length <=
                                        selectedParam
                                    ) {
                                        let actionToSend = {
                                            ...currentAction.Action,
                                            ...paramsTosent
                                        };

                                        execute(actionToSend);
                                        this.exit();
                                    } else {
                                        this.setState({
                                            value: "",
                                            currentParam: selectedParam,
                                            params: paramsTosent
                                        });
                                    }
                                }
                            }, 10);
                        }}
                        onChange={value => this.setState({ value })}
                        size="large"
                        onSearch={this.handleSearch}>
                        <Input
                            placeholder={
                                param ? param.Title : "Type the action name"
                            }
                            onKeyUp={e => {
                                if (e.key === "Escape") {
                                    e.preventDefault();
                                    this.setState({ visible: false });
                                }
                            }}
                            ref={node => {
                                this.input = node;
                            }}
                            size="large"
                            style={{
                                height: "40px",
                                backgroundColor: "#fBfAfA"
                            }}
                        />
                    </AutoComplete>
                </InputBox>
            </BackDrop>
        );
    }
}

export default select([s.labels], ["execute"])(CommandBar);
