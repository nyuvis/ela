import React, { PureComponent } from "react";
import { Tabs, Layout } from "antd";
import styled from "styled-components";
import { select } from "../lib/store";
import SeedsPanel from "./panels/SeedsPanel";
const TabPane = Tabs.TabPane;
const Sider = styled(Layout.Sider)`
    ${() => ""};
    background-color: white !important;
    .ant-layout-sider-trigger {
        background: white;
        color: black;
    }
`;
const TabsPanel = styled(Tabs)`
    .ant-tabs-content {
        height: 100%;
    }
`;

const Panels = [
    {
        Title: "Seeds",
        Component: SeedsPanel
    }
    // {
    //     Title: "Keywords",
    //     Component: () => <div>Not Implemented</div>
    // },
    // {
    //     Title: "LDA",
    //     Component: () => <div>Not Implemented</div>
    // }
];

class DiscoveryView extends PureComponent {
    constructor() {
        super();
        this.state = {};
    }
    renderColapset() {
        const { setLayout, width } = this.props;
        return (
            <div
                onClick={() => {
                    this.setState({ collapsed: false });
                    setLayout({ discoveryPanel: width });
                }}
                style={{
                    cursor: "pointer",
                    transform: "rotate(-90deg)",
                    position: "absolute",
                    top: "50%",
                    fontSize: "16px",
                    left: "-50px",
                    width: "130px"
                }}>
                Discovery Panel
            </div>
        );
    }
    renderPanel() {
        return (
            <TabsPanel
                defaultActiveKey="1"
                style={{
                    width: "100%",
                    height: "100%"
                }}>
                {Panels.map(({ Title, Component }, idx) => (
                    <TabPane
                        tab={Title}
                        key={idx + 1}
                        style={{
                            height: "100%"
                        }}>
                        <div
                            style={{
                                flex: "1",
                                height: "100%"
                            }}>
                            <Component />
                        </div>
                    </TabPane>
                ))}
            </TabsPanel>
        );
    }
    render() {
        const { setLayout, width } = this.props;

        return (
            <Sider
                collapsible
                collapsedWidth={40}
                width={width}
                collapsed={this.state.collapsed}
                onCollapse={status => {
                    this.setState({ collapsed: status });
                    setLayout({ discoveryPanel: status ? 40 : width });
                }}>
                {this.state.collapsed
                    ? this.renderColapset()
                    : this.renderPanel()}
            </Sider>
        );
    }
}

export default select(["layout.discoveryPanel"], ["setLayout"])(DiscoveryView);
