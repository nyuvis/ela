import { scaleLinear, scalePow } from "d3-scale";
import { extent } from "d3-array";
function computeBins(props) {
    const { data, width, height } = props;
    if (!data) return;
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

    countScale.domain(extent(Object.keys(buckets).map(d => buckets[d].count)));

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
    //this.computeKeywords({ ...buckets });
    return {
        colorScale: {
            domain: color.domain(),
            range: color.range()
        },
        //countScale: countScale,
        buckets: buckets,
        bucketSize: bucketSize
    };
}

const ACTIONS = {
    computeBinsProjection: computeBins
};

// eslint-disable-next-line no-undef
onmessage = function(e) {
    const data = e.data;
    console.time(data.action);
    let result = ACTIONS[data.action](data.payload);
    if (result.then) {
        result.then(result => {
            e.data.done = true;
            postMessage({ result: result });
            console.timeEnd(e.data.action);
        });
    } else {
        e.data.done = true;
        postMessage({
            result: result
        });
        console.timeEnd(e.data.action);
    }
};
