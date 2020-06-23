import React, { PureComponent } from "react";
import { scaleLinear, scaleQuantize } from "d3-scale";
import { max, extent, range } from "d3-array";
import { Stage, Layer, Rect, Circle } from "react-konva";
import { select, s } from "../lib/store";

function euclideanDistance(poin1, point2) {
    let deltaX = poin1.x - point2.x;
    let deltaY = poin1.y - point2.y;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

class Histogram2D extends PureComponent {
    constructor() {
        super();
        this.state = {
            selectionSet: new Set()
        };
    }
    mapPropsToState(props) {
        if (props.data && this.state.data !== props.data) {
            const { data, binsX, binsY } = props;
            let extentX = extent(data, d => +d.KeyX);
            let extentY = extent(data, d => +d.KeyY);

            let xScale = scaleQuantize()
                .domain(extentX)
                .range(range(0, binsX));
            let yScale = scaleQuantize()
                .domain(extentY)
                .range(range(0, binsY));

            let binsIndex = {};
            let binsXvalues = {};
            let binsYvalues = {};
            for (let d of data) {
                binsIndex[`${d.IdxX}-${d.IdxY}`] = d.Count;
                binsXvalues[d.IdxX] = +d.KeyX;
                binsYvalues[d.IdxY] = +d.KeyY;
            }

            this.setState({
                data: data,
                extentX,
                extentY,
                binsIndex,
                binsXvalues,
                binsYvalues,
                xScale,
                yScale
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        this.mapPropsToState(nextProps);
    }

    componentWillMount() {
        this.mapPropsToState(this.props);
    }

    componentDidUpdate(prevProps, prevState) {}

    componentDidMount() {
        window.addEventListener("mouseup", this.stopSelection);
        window.addEventListener("mousemove", this.updateSelection);
    }

    componentWillUnmount() {
        window.removeEventListener("mouseup", this.stopSelection);
        window.removeEventListener("mousemove", this.updateSelection);
    }
    clearSelection() {
        const { projectionSetSelection } = this.props;
        this.setState({ selecting: false, selectionSet: new Set() });
        projectionSetSelection(null, "Projection");
    }
    startSelection = (bucket, e) => {
        this.setState({
            selecting: true,
            selection: {
                started: Date.now(),
                mouseStart: { x: e.clientX, y: e.clientY },
                mouseEnd: { x: e.clientX, y: e.clientY },
                from: bucket,
                to: bucket
            }
        });
    };

    stopSelection = () => {
        const { projectionSetSelection } = this.props;
        const { selection, selectionSet, selecting } = this.state;

        if (selection && Date.now() - selection.started < 300) {
            //this.clearSelection()
        } else if (selecting) {
            let filter = this.getFilters(selectionSet);
            this.setState({ selecting: false, selection: null });
            projectionSetSelection(filter, "Projection");
        }
    };

    getSurrounding = (point, min, bucketsIndex, selectionSet) => {
        selectionSet = selectionSet || new Set();

        //let buckets = this.state.buckets;
        let bx = point.x;
        let by = point.y;
        let left = { key: `${bx - 1}-${by}`, x: bx - 1, y: by };
        let right = { key: `${bx + 1}-${by}`, x: bx + 1, y: by };
        let top = { key: `${bx}-${by - 1}`, x: bx, y: by - 1 };
        let bottom = { key: `${bx}-${by + 1}`, x: bx, y: by + 1 };

        let candidates = [left, right, top, bottom];

        selectionSet.add(point.key);
        for (let c of candidates) {
            let value = bucketsIndex[c.key];
            if (value && value > min && !selectionSet.has(c.key)) {
                this.getSurrounding(c, min, bucketsIndex, selectionSet);
            }
        }
        return selectionSet;
    };

    getFilters = selected => {
        const { textField } = this.props;
        const { binsXvalues, binsYvalues } = this.state;
        selected = Array.from(selected);

        let xBounds = extent(selected, s => +s.split("-")[0]);
        let rules = [];

        for (let i = xBounds[0]; i <= xBounds[1]; i++) {
            let ySelected = selected.filter(f => f.startsWith(i));
            let yExtent = extent(ySelected, s => +s.split("-")[1]);
            let xDomainExtent = [binsXvalues[i], binsXvalues[i + 1]];
            let yLeft = binsYvalues[yExtent[0]];
            let yRight = binsYvalues[yExtent[1] + 1];
            yRight = yRight ? yRight[1] : undefined;
            yLeft = yLeft ? yLeft[0] : undefined;

            let rule = {
                and: [
                    {
                        field: textField,
                        feature: `projection_point.x`,
                        gte: xDomainExtent[0],
                        lt: xDomainExtent[1]
                    }, //x
                    {
                        field: textField,
                        feature: `projection_point.y`,
                        gte: yLeft,
                        lt: yRight
                    } //y
                ]
            };
            rules.push(rule);
        }
        let rule = {
            or: rules
        };
        return rule;
    };

    updateSelection = e => {
        if (this.state && this.state.selecting) {
            const { xScale, yScale, binsIndex } = this.state;

            let startPoint = this.state.selection.mouseStart;
            let startBucket = this.state.selection.from;
            let endPoint = { x: e.clientX, y: e.clientY };

            let maxDistance = 100;

            let dist = euclideanDistance(startPoint, endPoint);
            let threshold = Math.max(0.1, 1 - dist / maxDistance);

            let currElement = startBucket;
            let currX = xScale(+currElement.KeyX);
            let currY = yScale(+currElement.KeyY);

            let selectionSet = this.getSurrounding(
                {
                    key: `${currX}-${currY}`,
                    x: currX,
                    y: currY
                },
                currElement.Count * threshold,
                binsIndex
            );

            this.setState({
                selectionSet: selectionSet,
                selection: {
                    ...this.state.selection,
                    mouseEnd: { x: e.clientX, y: e.clientY }
                }
            });
        }
    };

    getKey(bucket) {
        const { xScale, yScale } = this.state;
        return `${xScale(+bucket.KeyX)}-${yScale(+bucket.KeyY)}`;
    }

    offsetCoordinate(coord) {
        return [coord[0] - this.offset.x - 20, coord[1] - this.offset.y];
    }

    render() {
        const {
            width,
            height,
            xStats,
            yStats,
            binsX,
            binsY,
            filterProjection
        } = this.props;
        const { selectionSet, selection, data } = this.state;

        if (!data || !xStats) {
            return <svg width={width} height={height} />;
        }

        let xScale = scaleLinear()
            .range([0, width])
            .domain([xStats.Min, xStats.Max]);
        let yScale = scaleLinear()
            .range([0, height])
            .domain([yStats.Min, yStats.Max]);
        let maxCount = max(data, d => d.Count);

        //let linearDomain = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
        let PowDomain = [
            0.0016,
            0.0032,
            0.0075,
            0.015,
            0.03,
            0.06,
            0.12,
            0.25,
            0.5,
            1
        ];

        let color = scaleLinear()
            .range([
                "#fefefe",
                "#fff7f3",
                "#fde0dd",
                "#fcc5c0",
                "#fa9fb5",
                "#f768a1",
                "#dd3497",
                "#ae017e",
                "#7a0177",
                "black"
            ])
            .domain(PowDomain);
        let boxWidth = width / binsX;
        let boxHeight = height / binsY;

        let startPoint;
        let dist;
        if (selection && selection.mouseStart) {
            startPoint = this.offsetCoordinate([
                selection.mouseStart.x,
                selection.mouseStart.y
            ]);

            dist = euclideanDistance(selection.mouseStart, selection.mouseEnd);
            startPoint = [...startPoint, 300, 300];
        }

        return (
            <div
                style={{ textAlign: "center" }}
                ref={node => {
                    if (node) {
                        this.offset = node.getBoundingClientRect();
                    }
                }}>
                <Stage
                    width={width}
                    onClick={d => {
                        this.clearSelection();
                    }}
                    height={height}
                    style={{ margin: "0px 20px" }}>
                    <Layer>
                        {data.map(b => (
                            <Rect
                                onMouseDown={e => this.startSelection(b, e.evt)}
                                x={xScale(b.KeyX)}
                                y={yScale(b.KeyY)}
                                fill={
                                    filterProjection
                                        ? selectionSet.has(this.getKey(b))
                                            ? color(b.Count / maxCount)
                                            : "#ddd"
                                        : color(b.Count / maxCount)
                                }
                                key={`${b.KeyX}-${b.KeyY}`}
                                stroke={
                                    selectionSet.has(this.getKey(b)) &&
                                    !filterProjection &&
                                    "white"
                                }
                                width={boxWidth}
                                height={boxHeight}
                            />
                        ))}
                    </Layer>
                    {startPoint && (
                        <Layer>
                            <Circle
                                radius={dist}
                                x={startPoint[0]}
                                y={startPoint[1]}
                                stroke={"black"}
                            />
                        </Layer>
                    )}
                </Stage>
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
                                <linearGradient id="ProjectionLegend">
                                    {color
                                        .domain()
                                        .map(c => (
                                            <stop
                                                key={`k${c}`}
                                                offset={`${c * 100}%`}
                                                stopColor={color(c)}
                                            />
                                        ))}
                                </linearGradient>
                            </defs>
                            <rect
                                x="10"
                                y="10"
                                width="250"
                                height="20"
                                fill="url(#ProjectionLegend)"
                            />
                        </svg>
                    </div>
                    <div style={{ marginLeft: "10px" }}>{maxCount}</div>
                </div>
            </div>
        );
    }
}

export default select(
    [s.textField, "filter.projection"],
    ["projectionSetSelection"]
)(Histogram2D);
