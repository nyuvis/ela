import React, { PureComponent } from "react";
import { s, select } from "../../lib/store";
import { compileLabelFilter } from "../../lib/reducers/filter";
import { Query } from "react-apollo";
import { getLabelsMatrixQuery } from "../../lib/queries";
import { get } from "lodash";
import { scaleBand, scaleLinear } from "d3-scale";
import { max } from "d3-array";
import { Tooltip } from "antd";
import ErrorBoundary from "../../components/ErrorBoundary";

class Matrix extends PureComponent {
    constructor() {
        super();
        this.state = {};
    }
    getScales() {
        const { width, height, data } = this.props;
        let matrixWidth = Math.min(25 * data.Nodes.length, width - 100);
        let matrixHeight = Math.min(25 * data.Nodes.length, height);

        let xScale = scaleBand()
            .range([0, matrixWidth])
            .domain(data.Nodes.map(n => n.Key));
        let yScale = scaleBand()
            .range([0, matrixHeight])
            .domain(data.Nodes.map(n => n.Key));

        let maxCount = max(data.Links.map(link => link.Count));
        let colorScale = scaleLinear()
            .range(["white", "#4886FD"])
            .domain([0, maxCount]);

        return { xScale, yScale, colorScale, maxCount };
    }
    render() {
        const { width, data, onLinkClick } = this.props;
        const { linkHover, linkHoverInverse } = this.state;
        let { xScale, yScale, colorScale, maxCount } = this.getScales();
        console.log({
            fomain: xScale.domain(),
            range: xScale.range(),
            sample: xScale("NOISE"),
            sample0: xScale("New Label")
        });
        let height = data.Nodes.length * 25 + 100;
        return (
            <ErrorBoundary>
                <div>
                    <svg width={width} height={height}>
                        <defs>
                            <pattern
                                id="NULL"
                                width="10"
                                height="10"
                                patternUnits="userSpaceOnUse">
                                <rect width="50" height="50" fill="#eee" />
                                <line
                                    x1="0"
                                    x2="10"
                                    y1="0"
                                    y2="10"
                                    stroke="#999"
                                />
                                <line
                                    x1="10"
                                    x2="0"
                                    y1="0"
                                    y2="10"
                                    stroke="#999"
                                />
                            </pattern>
                        </defs>
                        {data.Nodes.map((node, idx) => {
                            return (
                                <g transform="translate(100,-5)" key={idx}>
                                    <text
                                        dy={100}
                                        transform={`rotate(-90, ${xScale(
                                            node.Key
                                        ) +
                                            xScale.bandwidth() / 2}, 100)`}
                                        dx={
                                            xScale(node.Key) +
                                            xScale.bandwidth() / 2
                                        }
                                        alignmentBaseline="middle"
                                        fill={
                                            linkHover &&
                                            (linkHoverInverse
                                                ? linkHover.Key[0] === node.Key
                                                    ? "red"
                                                    : "black"
                                                : linkHover.Key[1] === node.Key
                                                    ? "red"
                                                    : "black")
                                        }>
                                        {node.Key.substring(0, 12)}
                                    </text>
                                </g>
                            );
                        })}
                        <g transform="translate(0,100)">
                            {data.Nodes.map((node, idx) => {
                                return (
                                    <g key={idx}>
                                        <text
                                            dy={
                                                yScale(node.Key) +
                                                yScale.bandwidth() / 2
                                            }
                                            alignmentBaseline="middle"
                                            fill={
                                                linkHover &&
                                                (linkHoverInverse
                                                    ? linkHover.Key[1] ===
                                                      node.Key
                                                        ? "red"
                                                        : "black"
                                                    : linkHover.Key[0] ===
                                                      node.Key
                                                        ? "red"
                                                        : "black")
                                            }>
                                            {node.Key.substring(0, 12)}
                                        </text>
                                        <rect
                                            x={xScale(node.Key) + 100}
                                            y={yScale(node.Key)}
                                            width={xScale.bandwidth()}
                                            height={yScale.bandwidth()}
                                            fill="url(#NULL)"
                                        />
                                    </g>
                                );
                            })}
                            <g style={{ transform: "translate(100px,0px)" }}>
                                {data.Links.map((link, idx) => {
                                    return (
                                        <Tooltip
                                            key={idx}
                                            placement="bottom"
                                            title={link.Count}
                                            mouseEnterDelay={0}
                                            mouseLeaveDelay={0}>
                                            <rect
                                                onClick={() =>
                                                    onLinkClick(link)
                                                }
                                                onMouseEnter={() => {
                                                    this.setState({
                                                        linkHover: link,
                                                        linkHoverInverse: false
                                                    });
                                                }}
                                                onMouseLeave={() => {
                                                    this.setState({
                                                        linkHover: undefined,
                                                        linkHoverInverse: false
                                                    });
                                                }}
                                                key={idx}
                                                x={xScale(link.Key[1])}
                                                y={yScale(link.Key[0])}
                                                width={xScale.bandwidth()}
                                                height={yScale.bandwidth()}
                                                fill={colorScale(link.Count)}>
                                                <title>
                                                    {link.Key.join(", ")} ({
                                                        link.Count
                                                    })
                                                </title>
                                            </rect>
                                        </Tooltip>
                                    );
                                })}
                            </g>
                            <g style={{ transform: "translate(100px,0px)" }}>
                                {data.Links.map((link, idx) => {
                                    console.log(
                                        link,
                                        xScale(link.Key[1]),
                                        yScale(link.Key[0])
                                    );
                                    return (
                                        <Tooltip
                                            key={idx}
                                            placement="bottom"
                                            title={link.Count}
                                            mouseEnterDelay={0}
                                            mouseLeaveDelay={0}>
                                            <rect
                                                onMouseEnter={() => {
                                                    this.setState({
                                                        linkHover: link,
                                                        linkHoverInverse: true
                                                    });
                                                }}
                                                onMouseLeave={() => {
                                                    this.setState({
                                                        linkHover: undefined,
                                                        linkHoverInverse: false
                                                    });
                                                }}
                                                onClick={() =>
                                                    onLinkClick(link)
                                                }
                                                key={idx}
                                                x={xScale(link.Key[0])}
                                                y={yScale(link.Key[1])}
                                                width={xScale.bandwidth()}
                                                height={yScale.bandwidth()}
                                                fill={colorScale(link.Count)}
                                            />
                                        </Tooltip>
                                    );
                                })}
                            </g>
                        </g>
                    </svg>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginLeft: "10px"
                        }}>
                        <span>0</span>
                        <div>
                            <svg width="250" height="30">
                                <defs>
                                    <linearGradient id="MatrixLegend">
                                        <stop offset="0%" stopColor="white" />
                                        <stop
                                            offset="100%"
                                            stopColor="#4886FD"
                                        />
                                    </linearGradient>
                                </defs>
                                <rect
                                    x="10"
                                    y="10"
                                    width="250"
                                    height="20"
                                    fill="url(#MatrixLegend)"
                                />
                            </svg>
                        </div>
                        <div style={{ marginLeft: "10px" }}>{maxCount}</div>
                    </div>
                </div>
            </ErrorBoundary>
        );
    }
}

class InstersectionPanel extends PureComponent {
    render() {
        const { labels, textField, datasetId, setFilter, goToTab } = this.props;

        let adjMatrixFilters = labels.map(l => ({
            Name: l.Name,
            Filter: compileLabelFilter(l, { textField })
        }));
        let variables = {
            matrixFilters: adjMatrixFilters,
            field: textField,
            ID: datasetId
        };

        return (
            <ErrorBoundary>
                <Query query={getLabelsMatrixQuery} variables={variables}>
                    {({ data }) => {
                        if (!data || Object.keys(data).length === 0)
                            return <div />;

                        return (
                            <div style={{ padding: "10px" }}>
                                <Matrix
                                    onLinkClick={link => {
                                        let keys = new Set(link.Key);

                                        let selectedLabels = labels
                                            .filter(l => keys.has(l.Name))
                                            .map(l => l.ID);

                                        setFilter({
                                            selectedLabels: selectedLabels,
                                            joinMethod: {
                                                ALL: selectedLabels,
                                                ANY: [],
                                                NOT: []
                                            }
                                        });
                                        goToTab("Info");
                                        // serFullFilter(
                                        //     [],
                                        //     keys.map(k => Topics.find(t => t.Topic === k).ID),
                                        //     "intersection"
                                        // );
                                        // this.props.goToTab("Info");
                                    }}
                                    width={300}
                                    height={300}
                                    data={get(data, [
                                        "Dataset",
                                        "Select",
                                        "AdjMatrix"
                                    ])}
                                />
                            </div>
                        );
                    }}
                </Query>
            </ErrorBoundary>
        );
    }
}

export default select([s.labels, s.textField, s.datasetID], ["setFilter"])(
    InstersectionPanel
);
