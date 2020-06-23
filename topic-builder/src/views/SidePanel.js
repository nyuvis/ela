import React, { PureComponent } from "react";
import { Tabs, Layout } from "antd";
import styled from "styled-components";
import { select } from "../lib/store";
import ErrorBoundary from "../components/ErrorBoundary";

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

class SidePanel extends PureComponent {
  constructor() {
    super();
    this.state = { activeTab: "1" };
  }
  renderColapset() {
    const { setLayout, width, dataKey, display } = this.props;
    return (
      <div
        onClick={() => {
          this.setState({ collapsed: false });
          setLayout({ [dataKey]: width });
        }}
        style={{
          display: display,
          cursor: "pointer",
          transform: "rotate(-90deg)",
          position: "absolute",
          top: "50%",
          fontSize: "16px",
          left: "-50px",
          width: "130px"
        }}
      >
        Discovery Panel
      </div>
    );
  }
  toTab = tabName => {
    const { Panels } = this.props;
    let idx = Panels.findIndex(p => p.Title === tabName);
    this.setState({
      activeTab: (idx + 1).toString()
    });
  };
  renderPanel() {
    const { Panels } = this.props;
    return (
      <TabsPanel
        activeKey={this.state.activeTab}
        defaultActiveKey="1"
        onChange={id => {
          this.setState({ activeTab: id });
        }}
        style={{
          width: "100%",
          height: "100%"
        }}
      >
        {Panels.map(({ Title, Component }, idx) => (
          <TabPane
            tab={Title}
            key={idx + 1}
            style={{
              height: "100%"
            }}
          >
            <div
              style={{
                display: "flex",
                flex: "1",
                height: "100%"
              }}
            >
              <Component goToTab={this.toTab} />
            </div>
          </TabPane>
        ))}
      </TabsPanel>
    );
  }
  render() {
    const { setLayout, width, side, dataKey } = this.props;

    return (
      <Sider
        collapsible
        collapsedWidth={40}
        width={width}
        reverseArrow={side === "right"}
        collapsed={this.state.collapsed}
        onCollapse={status => {
          this.setState({ collapsed: status });
          setLayout({ [dataKey]: status ? 40 : width });
        }}
      >
        <ErrorBoundary>
          {this.state.collapsed ? this.renderColapset() : this.renderPanel()}
        </ErrorBoundary>
      </Sider>
    );
  }
}

export default select(["layout"], ["setLayout"])(SidePanel);
