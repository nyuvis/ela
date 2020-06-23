import React, { PureComponent } from "react";
import { scaleLinear, scalePow } from "d3-scale";
import { extent } from "d3-array";
import { flatten, maxBy } from "lodash";
import { getKeywordsByFilters } from "../lib/queries";
import { runTask } from "../lib/processing";
import KeywordSet from "./keywordSets";

function euclideanDistance(poin1, point2) {
    let deltaX = poin1.x - point2.x;
    let deltaY = poin1.y - point2.y;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

export default class Projection extends PureComponent {
    constructor() {
        super();
        this.state = {};
    }

    componentWillMount() {
        this.computeBins(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.computeBins(nextProps);
    }

    startSelection = (bucket, e) => {
        this.setState({
            selecting: true,
            selection: {
                mouseStart: { x: e.clientX, y: e.clientY },
                mouseEnd: { x: e.clientX, y: e.clientY },
                from: bucket,
                to: bucket
            }
        });
    };
    stopSelection() {
        const { selectionSet, buckets } = this.state;
        if (selectionSet.size > 0) {
            let ids = Array.from(selectionSet).map(s => buckets[s].docs);
            ids = flatten(ids);
            if (ids.length > 0) {
                this.props.selectIds(ids);
            }
        }
        this.setState({ selecting: false });
    }

    getSurrounding(point, min, selectionSet, buckets = this.state.buckets) {
        //let buckets = this.state.buckets;
        let bx = point.bx;
        let by = point.by;
        let left = buckets[`${bx - 1}-${by}`];
        let right = buckets[`${bx + 1}-${by}`];
        let top = buckets[`${bx}-${by - 1}`];
        let bottom = buckets[`${bx}-${by + 1}`];

        let candidates = [left, right, top, bottom];
        selectionSet.add(point.key);
        for (let c of candidates) {
            if (
                c &&
                //c.count < point.count &&
                c.count > min &&
                !selectionSet.has(c.key)
            ) {
                this.getSurrounding(c, min, selectionSet, buckets);
            }
        }
    }

    updateSelection(e) {
        if (this.state && this.state.selecting) {
            let startPoint = this.state.selection.mouseStart;
            let startBucket = this.state.selection.from;
            let endPoint = { x: e.clientX, y: e.clientY };
            let maxDistance = 50;
            let dist = euclideanDistance(startPoint, endPoint);

            let proportion = Math.max(0.1, 1 - dist / maxDistance);
            let selectionSet = new Set();
            this.getSurrounding(
                startBucket,
                proportion * startBucket.count,
                selectionSet
            );
            this.setState({
                selectionSet: selectionSet
            });
        }
    }

    computeBins(props) {
        const { data, width, height } = props;
        if (!data) return;
        console.time("callComputeBinsProjection");
        runTask({
            action: "computeBinsProjection",
            payload: { data, width, height }
        }).then(r => {
            console.timeEnd("callComputeBinsProjection");
            console.log(r);
        });
        console.time("LocalComputeBinsProjection");
        let bucketSize = 5;

        let xScale = scaleLinear()
            .range([0, width])
            .domain(extent(data, d => +d[1]));
        let yScale = scaleLinear()
            .range([0, height])
            .domain(extent(data, d => +d[2]));

        let countScale = scaleLinear();

        let buckets = {};
        data.map(d => {
            let x = xScale(+d[1]);
            let y = yScale(+d[2]);
            let id = d[0];
            let xBucket = Math.floor(x / bucketSize);
            let yBubket = Math.floor(y / bucketSize);
            let bucketID = `${xBucket}-${yBubket}`;
            let bucket = buckets[bucketID] || {
                key: bucketID,
                bx: Math.floor(x / bucketSize),
                by: Math.floor(y / bucketSize),
                x: xBucket * bucketSize,
                y: yBubket * bucketSize,
                count: 0,
                docs: []
            };
            bucket.count += 1;
            bucket.docs.push(d[0]);
            if (bucketID !== "NaN-NaN") {
                buckets[bucketID] = bucket;
            }
            return { x, y, id, bucketID, xBucket, yBubket };
        });

        countScale.domain(
            extent(Object.keys(buckets).map(d => buckets[d].count))
        );

        let color = scalePow()
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
                "#49006a"
            ])
            .domain([
                0,
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
            ]);
        console.timeEnd("LocalComputeBinsProjection");
        this.computeKeywords({ ...buckets });
        this.setState({
            colorScale: color,
            countScale: countScale,
            buckets: buckets,
            bucketSize: bucketSize
        });
    }

    computeKeywords(buckets) {
        const { datasetId } = this.props;
        console.time("computeKeywords");
        let keys = Object.keys(buckets);

        let proportion = 0.5;
        let suggestions = [];
        for (let i = 0; i < 10; i++) {
            let bucketsArr = keys.map(d => buckets[d]);
            let maxBucket = maxBy(bucketsArr, d => d.count);
            let selectionSet = new Set();
            this.getSurrounding(
                maxBucket,
                proportion * maxBucket.count,
                selectionSet,
                buckets
            );
            let selectionArr = Array.from(selectionSet);
            let ids = flatten(selectionArr.map(k => buckets[k].docs));
            suggestions.push(ids);
            for (let b of selectionArr) {
                buckets[b] = { ...b, count: 0 };
            }
        }
        console.timeEnd("computeKeywords");
        console.time("getComputeKeywords");
        getKeywordsByFilters({
            ID: datasetId,
            field: "text",
            splitFilters: suggestions.map((d, idx) => ({
                Key: idx,
                Filter: {
                    field: "text",
                    ids: d
                }
            }))
        }).then(r => {
            console.timeEnd("getComputeKeywords");
            this.setState({
                keywordSetData: r.data.Dataset.Select.Split.map(d => ({
                    Topic: d.Values.map(k => k.Key)
                        .slice(0, 3)
                        .join(", "),
                    Keywords: d.Values.map(k => ({ Keyword: k.Key, Weight: 1 }))
                }))
            });
        });
    }

    computeSelection(buckets) {}
    renderBinned() {
        const { width, height } = this.props;
        const {
            colorScale,
            countScale,
            buckets,
            bucketSize,
            selectionSet = new Set(),
            keywordSetData = []
        } = this.state;
        if (!buckets) {
            return (
                <svg
                    widt={width}
                    height={height}
                    onClick={() => {
                        this.props.selectIds([]);
                    }}
                    style={{ border: "solid 1px #000" }}
                />
            );
        }
        return (
            <div
                style={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "column"
                }}>
                <div style={{ textAlign: "center" }}>
                    <svg
                        width={width}
                        height={height}
                        onMouseUp={e => {
                            if (this.state.selecting) {
                                this.stopSelection();
                            } else {
                                this.props.selectIds([]);
                                this.setState({ selectionSet: new Set() });
                            }
                        }}
                        onMouseMove={e => this.updateSelection(e)}
                        style={{ border: "solid 1px #000" }}>
                        {Object.keys(buckets).map(key => {
                            let bucket = buckets[key];
                            return (
                                <rect
                                    onMouseDown={e =>
                                        this.startSelection(bucket, e)
                                    }
                                    key={key}
                                    x={bucket.x}
                                    y={bucket.y}
                                    width={bucketSize}
                                    height={bucketSize}
                                    stroke={
                                        selectionSet && selectionSet.has(key)
                                            ? "white"
                                            : "none"
                                    }
                                    fill={
                                        selectionSet.size === 0 ||
                                        this.state.selecting
                                            ? colorScale(
                                                  countScale(bucket.count)
                                              )
                                            : selectionSet.has(key)
                                                ? colorScale(
                                                      countScale(bucket.count)
                                                  )
                                                : "#eee"
                                    }
                                />
                            );
                        })}
                    </svg>
                </div>

                <KeywordSet data={keywordSetData} />
            </div>
        );
    }

    render() {
        return this.renderBinned();
    }
}
