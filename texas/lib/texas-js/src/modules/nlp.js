const fs = require("fs");
const { maxBy, range } = require("lodash");
const { scaleQuantize, extent } = require("d3");
const { parseFilters } = require("../utils");

class TexasNLP {
    constructor(config) {
        this.config = config;
        const NLPServer = require(`../connectors/${config.connector.name}`);
        this.server = new NLPServer(config.connector.config);
    }

    async getProjectionKeywords({
        method,
        dataset,
        filter,
        field,
        interval = 1
    }) {
        const getSurrounding = (point, min, bucketsIndex, selectionSet) => {
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
                    getSurrounding(c, min, bucketsIndex, selectionSet);
                }
            }
            return selectionSet;
        };

        const {
            ignoreTerms,
            projectioField = "projection",
            binsX = 50,
            binsY = 40,
            threshold = 0.1,
            num_keywords = 20,
            num_topics = 10
        } = method;

        let params = {
            field,
            featureX: `${projectioField}.x`,
            featureY: `${projectioField}.y`,
            binsX,
            binsY
        };

        let projection = await dataset.db.histogram2D(filter, params);
        let extentX = extent(projection, d => d.KeyX);
        let extentY = extent(projection, d => d.KeyY);

        let xScale = scaleQuantize()
            .domain(extentX)
            .range(range(0, binsX));
        let yScale = scaleQuantize()
            .domain(extentY)
            .range(range(0, binsY));

        let binsIndex = {};
        for (let d of projection) {
            binsIndex[`${d.IdxX}-${d.IdxY}`] = d.Count;
            //binsIndex[`${xScale(d.KeyX)}-${yScale(d.KeyY)}`] = d.Count;
        }

        let topicsRules = [];
        for (let i = 0; i < num_topics; i++) {
            if (projection.length === 0) {
                break;
            }
            let currElement = maxBy(projection, d => d.Count);
            let currX = xScale(currElement.KeyX);
            let currY = yScale(currElement.KeyY);
            let surrounding = getSurrounding(
                {
                    key: `${currX}-${currY}`,
                    x: currX,
                    y: currY
                },
                currElement.Count * threshold,
                binsIndex
            );
            let selected = Array.from(surrounding);
            let xBounds = extent(selected, s => +s.split("-")[0]);
            let filtres = [];
            let rules = [];
            for (let i = xBounds[0]; i <= xBounds[1]; i++) {
                let ySelected = selected.filter(f => f.startsWith(i));
                let yExtent = extent(ySelected, s => +s.split("-")[1]);

                let xDomainExtent = xScale.invertExtent(i);
                let yLeft = yScale.invertExtent(yExtent[0]);
                let yRight = yScale.invertExtent(yExtent[1]);

                let rule = {
                    and: [
                        {
                            field,
                            feature: `${projectioField}.x`,
                            gte: xDomainExtent[0],
                            lt: xDomainExtent[1]
                        }, //x
                        {
                            field,
                            feature: `${projectioField}.y`,
                            gte: yLeft[0],
                            lt: yRight[1]
                        } //y
                    ]
                };
                rules.push(rule);
            }
            topicsRules.push({ or: rules });
            projection = projection.filter(
                p => !surrounding.has(`${xScale(p.KeyX)}-${yScale(p.KeyY)}`)
            );
        }

        let data = await dataset.db.values(filter, {
            split: {
                filters: topicsRules.map((d, idx) => ({
                    Key: `k${idx}`,
                    Filter: parseFilters(d)
                }))
            },
            field,
            size: num_keywords,
            removeStop: true,
            discriminant: true,
            exclude: ignoreTerms,
            ignore: []
        });

        let usedKeywords = new Set();

        return Object.keys(data)
            .map(k => ({
                ID: k,
                Topic: data[k]
                    //.filter(d => !usedKeywords.has(d.Key))
                    .slice(0, 3)
                    .map(d => d.Key)
                    .join(", "),
                Keywords: data[k]
                    //.filter(d => !usedKeywords.has(d.Key))
                    .map(d => {
                        usedKeywords.add(d.Key);
                        return {
                            Keyword: d.Key,
                            Count: d.Stat,
                            Weight: 1
                        };
                    })
            }))
            .filter(d => d.Keywords.length > 0);
    }

    async GetTopicModel(
        method,
        { datasource_info, dataset, filter, field, ...ignoreTerms }
    ) {
        if (method.method === "PROJECTION") {
            return this.getProjectionKeywords({
                method,
                datasource_info,
                dataset,
                filter,
                field,
                ignoreTerms
            });
        }

        if (method.method === "LDA") {
            let file = `/nlp/projections/${dataset.ID}/lda_${field}.csv`;
            let data = fs.readFileSync(file, { encoding: "utf8" });
            data = data.split("\n").map(line =>
                line.split(", ").map(k =>
                    k
                        .replace(/"/g, "")
                        .replace(/\r/g, "")
                        .trim()
                )
            );
            return data.map((d, idx) => ({
                ID: idx,
                Topic: d.slice(0, 3).join(", "),
                Keywords: d.map(k => ({
                    Keyword: k,
                    Weight: 1
                }))
            }));
        }
        let task = {
            task: "GET_TOPIC_MODEL",
            params: { datasource: datasource_info, method }
        };

        return this.server.sendTask(task).then(({ response }) => {
            return response.map(d => ({
                ID: 1,
                Topic: d
                    .slice(0, 3)
                    .map(k => k.keyword)
                    .join(", "),
                Keywords: d.map(k => ({
                    Keyword: k["keyword"],
                    Weight: k.weight
                }))
            }));
        });
    }

    async Projection(datasetID, method = "tsne", field) {
        try {
            let data = `${
                this.config.projections_path
            }/${datasetID}/${method.toLocaleLowerCase()}_${field.toLocaleLowerCase()}.csv`;
            data = fs.readFileSync(data, { encoding: "utf8" });
            data = data
                .split("\n")
                .map(line =>
                    line
                        .split(" ")
                        .map(k => k.replace(/"/g, "").replace(/\r/g, ""))
                );
            return data;
        } catch (err) {
            console.error(err);
            return [[]];
        }
    }

    async KeywordTopics(params, data) {
        console.warn("TexasNLP.KeywordTopics is deprecated");
        let task = {
            task: "GET_TOPIC_MODEL",
            datasource: {
                type: data.datasource.Provider,
                connection: data.datasource.Config,
                query: data.query,
                selector: data.selector,
                query_type: "KEYWORDS"
            },
            params: params
        };
        return this.server.sendTask(task).then(result => {
            return result.map(d => ({
                ID: 1,
                Topic: d.slice(0, 3).join(", "),
                Keywords: d.map(k => ({ Keyword: k }))
            }));
        });
    }
}

// "task": "GET_TOPICS",
// "datasource": {
//     "type": "ElasticSearch",
//     "connection": {
//         "client": {
//             "hosts": [
//                 {
//                     "host": "nyuvis-web.poly.edu",
//                     "port": 80,
//                     "path": "es"
//                 }
//             ]
//         },
//         "index": "vox-news",
//         "type": "vox_document"
//     },
//     "query": {
//         "query": {
//             "bool": {}
//         },
//         "size": 0,
//         "aggs": {
//             "keywords": {
//                 "terms": {
//                     "field": "body",
//                     "size": 1000
//                 }
//             }
//         }
//     },
//     "selector": "aggregations.keywords.buckets",
//     "query_type": "KEYWORDS",

// },
// "params": {
//     "dataset": "VoxNews",
//     "text_field": "body",
//     "model_name": "texas_trained_w2v",
//     "max_words": 5
// }

module.exports = TexasNLP;
