const elasticsearch = require("elasticsearch");
const bob = require("elastic-builder");
const { Document } = require("../entities/document");
const { startCase, orderBy, isArray } = require("lodash");
const { list: stopwordList } = require("../resources/stopwords");
const { get, flatten } = require("lodash");

function copyQuery(query) {
    let q = bob.requestBodySearch();
    q._body = query.toJSON();
    return q;
}

const getType = (type, meta) => {
    switch (type) {
        case "keyword":
            return "CATEGORICAL";
        case "text":
            return "TEXT";
        case "date":
            return "DATE";
        case "long":
            return "INTEGER";
        case "float":
            return "DECIMAL";
        case "string":
            if (meta.analyzer) return "TEXT";
            else return "CATEGORICAL";
        default:
            return "CATEGORICAL";
    }
};

const printQuery = query => {
    console.info(JSON.stringify(query.toJSON(), null, 4));
};

const sigmoid = (norm, { maxThreshold }) => {
    let script = maxThreshold
        ? "(1/(1+Math.exp(-_score*params.norm)) < params.maxThreshold ? (1/(1+Math.exp(-_score*params.norm))) : -1)"
        : "1/(1+Math.exp(-_score*params.norm))";
    return bob.scriptScoreFunction(
        bob
            .script("inline", script)
            .lang("painless")
            .params({ norm: norm, maxThreshold: maxThreshold })
    );
};

class Elasticsearch {
    constructor(config, Type) {
        if (typeof config === "string") {
            config = JSON.parse(config);
        }
        this.config = config;
        this.client = new elasticsearch.Client({ ...config.client });
        this.index = config.index;
        this.type = config.type;
        this.baseBody = {
            index: this.index,
            type: this.type
        };
    }

    getConfig() {
        let config = { ...this.config, index: this.index, type: this.type };
        return {
            Provider: "ElasticSearch",
            Config: config
        };
    }

    async createRepository(index) {
        let exists = await this.client.indices
            .exists({
                index: index
            })
            .catch(err => {
                console.error(err);
            });
        if (!exists) {
            await this.client.indices.create({
                index: index,
                body: {
                    mappings: {
                        document: { dynamic_templates: DYNAMIC_TAMPLATES }
                    },
                    settings: BASE_SETTINGS
                },
                ignore: 400
            });
        }
        this.index = index;
        this.type = "document";
        this.baseBody = {
            index: this.index,
            type: this.type
        };
    }

    setRepository(repository) {
        this.index = repository;
        this.type = "document";
        this.baseBody = {
            index: this.index,
            type: this.type
        };
    }

    async create(document, ID) {
        document.ID = document.ID || ID;
        let config = {
            index: this.index,
            type: this.type,
            id: document.ID,
            body: document,
            ignore: [400, 409]
        };
        this.client.create(config);
    }

    async withIndex({ index, type }, cmd) {
        let currentIndex = this.index;
        let currentType = this.type;
        this.index = index;
        this.type = type;
        let result = await cmd(this);
        this.index = currentIndex;
        this.type = currentType;
        return result;
    }

    async createOrUpdateMany(documents) {
        let actions = [];
        for (let document of documents) {
            actions.push({
                index: {
                    _index: this.index,
                    _type: this.type,
                    _id: document.ID
                }
            });
            actions.push(document.data);
        }
        let config = {
            body: actions
        };
        return this.client
            .bulk(config)
            .then(r => {
                if (r.errors) {
                    console.error(JSON.stringify(r.items, null, 4));
                    throw "Could save all: \n" + JSON.stringify(r.items, null, 4);
                }

                return true;
            })
            .catch(err => {
                console.error(err);
                return false;
            });
    }

    async createOrUpdate(document, ID) {
        document.ID = document.ID || ID;
        let config = {
            index: this.index,
            type: this.type,
            id: document.ID,
            body: document,
            ignore: [400, 409]
        };
        return this.client.index(config).then(result => {
            document.ID = result._id;
            let doc = {
                ID: result._id,
                Raw: document
            };
            return new Document(doc);
        });
    }

    async exec(body, raw) {
        if (!raw) {
            body = body.toJSON();
        }
        return this.client.search({
            index: this.index,
            type: this.type,
            body: body
        });
    }

    copyQuery(query) {
        let q = bob.requestBodySearch();
        q._body = query.toJSON();
        return q;
    }

    async highlightFields(highlights, query) {
        let bobHighlight = bob.highlight(highlights.map(h => h.field));

        bobHighlight
            .requireFieldMatch(false)
            .noMatchSize(250)
            .forceSource(true);

        for (let h of highlights) {
            console.log("Num Fragments", h.numFragments || 25);
            if (h.highlight) {
                bobHighlight.numberOfFragments(h.numFragments || 25);
                bobHighlight.fragmentSize(h.fragmentSize || 200);
                query.highlight(bobHighlight.highlightQuery(bob.boolQuery().should(bob.queryStringQuery(h.highlight.join(" "))), h.field));
            }
        }
        query.highlight(bobHighlight);

        return query;
    }

    async keepOnlyRequestedFields(ast, query) {
        let astJSON = astToJson(ast, true);
        let docFields = astJSON[findKeys("Documents", astJSON)[0]];
        let hasRaw = findKeys("Raw", docFields).length > 0;

        if (!hasRaw) {
            let schema = await this.Schema();
            let fields = findKeys("Field", docFields).map(key => {
                let param = docFields[key].__arguments;
                if (param[":ID"]) {
                    return param[":ID"];
                }
                if (param[":name"]) {
                    return schema.IndexName[param[":name"]].ID;
                }
            });

            query.source(fields.length === 0 ? false : fields);
            return query;
        }
        return query;
    }

    getFeaturePath(field, feature, tokenized) {
        if (!tokenized) {
            return `__nlp__.${field}.${feature}.keyword`;
        } else {
            return `__nlp__.${field}.${feature}`;
        }
    }

    async parseNLP(mapping = {}) {
        let types = Object.keys(mapping).map(async field => {
            return {
                ID: field,
                Name: startCase(field),
                Type: getType(mapping[field].type, mapping[field]),
                SubFields: mapping[field].properties && (await this.parseNLP(mapping[field].properties)),
                raw: mapping[field]
            };
        });
        let result = await Promise.all(types);

        return result.reduce((prev, curr) => {
            prev[curr.ID] = curr;
            return prev;
        }, {});
    }

    async Schema() {
        if (!this._schema) {
            this._schema = this.client.indices
                .getMapping({
                    index: this.index,
                    type: this.type
                })
                .then(async mapping => {
                    mapping = mapping[this.index].mappings[this.type].properties;
                    let types = Object.keys(mapping)
                        .filter(field => field != "__nlp__")
                        .map(field => ({
                            ID: field,
                            Name: startCase(field),
                            Type: getType(mapping[field].type, mapping[field]),
                            raw: mapping[field]
                        }));

                    let IndexID = {};
                    let IndexName = {};
                    for (let t of types) {
                        IndexID[t.ID] = t;
                        IndexName[t.Name] = t;
                    }

                    let NLP = await this.parseNLP(mapping.__nlp__ && mapping.__nlp__.properties);

                    return {
                        NLP: NLP,
                        Fields: types,
                        IndexID: IndexID,
                        IndexName: IndexName
                    };
                });
        }
        return this._schema.then(schema => {
            return schema;
        });
    }

    async getType(field) {
        let schema = await this.Schema();
        let fieldInfo = schema.IndexID[field];
        return fieldInfo ? fieldInfo.Type : "CATEGORICAL";
    }

    async compileRuleList({ rules }, field) {
        const filters = bob.boolQuery();

        let ruleQueries = rules.map(r => {
            r = { ...r };
            r.query = bob.queryStringQuery(r.rule).defaultField(r.field || field);
            return r;
        });

        for (let [idx, rule] of ruleQueries.entries()) {
            if (!rule.then) {
                continue;
            }
            let pathMustNotMatch = ruleQueries
                .slice(0, idx)
                .filter(r => r.if)
                .map(r => r.query);

            let pathMustMatch = ruleQueries
                .slice(0, idx)
                .filter(r => !r.if)
                .map(r => r.query);

            let localRule;
            if (rule.if && rule.then) {
                localRule = rule.query;
            } else if (rule.if && !rule.then) {
                localRule = bob.boolQuery().mustNot(rule.query);
            } else if (!rule.if && rule.then) {
                localRule = bob.boolQuery().mustNot(rule.query);
            } else if (!rule.if && !rule.then) {
                localRule = rule.query;
            }

            if (pathMustMatch.length + pathMustNotMatch.length > 0) {
                let finalRule = bob.boolQuery();
                if (pathMustMatch.length) {
                    finalRule.must(pathMustMatch);
                }
                if (pathMustNotMatch.length) {
                    finalRule.mustNot(pathMustNotMatch);
                }
                finalRule.must(localRule);
                filters.should(finalRule);
            } else {
                filters.should(localRule);
            }
        }

        return filters;
    }

    async compileScoredKeywordsSearch(filter, field, query = this.search(), returnQuery = false) {
        const norm = 1;

        const { onlyLowThreshold, threshold, function: func, useTFIDF, keywords, ignoreThreshold } = filter;
        const scoreFunction = sigmoid(1, {
            maxThreshold: onlyLowThreshold && threshold
        });
        const filters = bob.boolQuery();
        const wrap = word_query => (useTFIDF ? word_query : bob.constantScoreQuery(word_query));
        for (let keyword of keywords) {
            let q = wrap(bob.queryStringQuery(keyword.Keyword).defaultField(field)).boost(keyword.Weight === 0 ? 0.00001 : keyword.Weight);
            filters.should(q);
        }

        const functionQuery = bob
            .functionScoreQuery()
            .query(filters)
            .function(scoreFunction)
            .boostMode("replace");

        if (!ignoreThreshold) {
            functionQuery.minScore(threshold || 0.5);
        }
        if (onlyLowThreshold) {
            functionQuery.minScore(0);
        }

        return functionQuery;
    }

    async countDistinct(filter, { field, feature, split, query }) {
        query = query || (await this.getESFilter({ filter }));
        if (feature) {
            field = this.getFeaturePath(field, feature, true);
        }
        let agg = bob.cardinalityAggregation("distinct", field).precisionThreshold(40000);

        function parseResults(result) {
            return result.distinct.value;
        }
        if (split) {
            return this.split(split, query, agg, parseResults);
        }
        query.agg(agg);
        let result = await this.exec(query);
        return parseResults(result.aggregations);
    }

    async parseFilter(filter, base) {
        if (filter.hasFeature) {
            let featurePath = this.getFeaturePath(filter.field, filter.hasFeature.name, !filter.hasFeature.exact);
            if (filter.hasFeature.values) {
                return bob.termsQuery(featurePath, filter.hasFeature.values);
            } else {
                return bob.existsQuery(featurePath);
            }
        }

        if (filter.ruleList) {
            return this.compileRuleList(filter.ruleList, filter.field);
        }

        if (filter.scoredKeywords) {
            return this.compileScoredKeywordsSearch(filter.scoredKeywords, filter.field);
        }

        if (filter.$type === "compound") {
            let query = bob.boolQuery();
            if (filter.and) {
                query.must(await Promise.all(filter.and.map(f => this.parseFilter(f))));
            }
            if (filter.or) {
                query.should(await Promise.all(filter.or.map(f => this.parseFilter(f))));
            }
            if (filter.not) {
                query.mustNot(await Promise.all(filter.not.map(f => this.parseFilter(f))));
            }
            return query;
        }

        if (filter.$type === "id") {
            return bob.idsQuery(null, filter.ids);
        }

        if (filter.$type === "logical") {
            let schema = await this.Schema();
            let field = filter["field"];
            if (!schema.IndexID[field]) {
                throw "I couldn't find this field: " + field;
            }
            let type = schema.IndexID[field].Type;
            if (filter.feature) {
                type = get(schema.NLP, [field, ...flatten(filter.feature.split(".").map(d => ["SubFields", d])), "Type"]);
                field = `__nlp__.${field}.${filter.feature}`;
            }

            switch (type) {
                case "TEXT":
                case "CATEGORICAL":
                    if (filter.eq) {
                        return bob.termQuery(field, filter.eq);
                    }
                    if (filter.in) {
                        return bob.termsQuery(field, filter.in);
                    }
                    if (filter.all) {
                        let q = bob.boolQuery();
                        q.must(filter.all.map(d => bob.termQuery(field, d)));
                        return q;
                    }
                    if (filter.query) {
                        return bob.boolQuery().should(filter.query.map(value => bob.queryStringQuery(value).defaultField(field)));
                    }
                    if (filter.regex) {
                        return bob.regexpQuery(field, filter.regex);
                    }

                    if (filter.likeThis) {
                        let q = bob.moreLikeThisQuery().fields([field]);
                        let values = isArray(filter.likeThis) ? filter.likeThis : [filter.likeThis];
                        for (let v of values) {
                            if (v.startsWith("_text:")) {
                                v = v.replace("_text:");
                                q.like(v);
                            } else {
                                q.like({
                                    _index: this.index,
                                    _type: this.type,
                                    _id: v
                                });
                            }
                        }
                        return q;
                    }
                    break;
                case "DATE": {
                    let query = bob.rangeQuery(field);
                    if (filter.gt) {
                        query.gt(filter.gt);
                    }
                    if (filter.gte) {
                        query.gte(filter.gte);
                    }
                    if (filter.lt) {
                        query.lt(filter.lt);
                    }
                    if (filter.lte) {
                        query.lte(filter.lte);
                    }
                    return query;
                }

                case "DECIMAL": {
                    let query = bob.rangeQuery(field);
                    if (filter.gt) {
                        query.gt(filter.gt);
                    }
                    if (filter.gte) {
                        query.gte(filter.gte);
                    }
                    if (filter.lt) {
                        query.lt(filter.lt);
                    }
                    if (filter.lte) {
                        query.lte(filter.lte);
                    }
                    return query;
                }

                default:
                    break;
            }
        }
    }

    search(template) {
        let query = bob.requestBodySearch();
        query.size(0);
        if (template) {
            query._body.query = template._body.query;
        }
        return query;
    }

    async getESFilter(args = {}) {
        const query = this.search();
        const filters = bob.boolQuery();
        if (args.ids) {
            filters.must(bob.idsQuery(this.type, args.ids));
        }
        if (args.filter) {
            console.log(args.filter);
            let filter_query = await this.parseFilter(args.filter);
            filters.must(filter_query);
        }

        query.query(filters);
        return query;
    }

    async split({ filters } = [], query, sourceAgg, parser) {
        if (sourceAgg) {
            if (filters) {
                for (let filter of filters) {
                    query.agg(bob.filterAggregation(filter.Key, await this.parseFilter(filter.Filter)).agg(sourceAgg));
                }
            }

            return this.splitParse(this.exec(query), parser);
        } else {
            let agg = bob.filtersAggregation("split");

            if (filters) {
                for (let filter of filters) {
                    agg.filter(filter.Key, await this.parseFilter(filter.Filter));
                }
            }
            query.agg(agg);
            return this.splitParse(this.exec(query), parser);
        }
    }

    splitParse(promise, parser) {
        return promise.then(result => {
            let buckets = get(result, "aggregations.split.buckets");
            if (!buckets) {
                buckets = get(result, "aggregations");
            }
            for (let bucket in buckets) {
                if (parser) {
                    buckets[bucket] = parser(buckets[bucket]);
                }
            }
            return buckets;
        });
    }

    async count(filter, { query, ids, split } = {}, partial) {
        query = query || (await this.getESFilter({ filter, ids }));
        if (split) {
            return this.split(split, query, null, b => b.doc_count);
        }
        function parseResults(result) {
            return result.hits.total;
        }
        let result = await this.exec(query);
        return parseResults(result);
    }

    async get({ ID, field }, context, ast) {
        let params = { ...this.baseBody, id: ID };
        let d = await this.client.get(params);
        let doc = {
            ID: d._id,
            Raw: d._source,
            Score: d._score,
            Highlights: d.highlight
        };
        return new Document(doc);
    }

    async getNativeQuery(filter, { size = 100, from, query, highlights = [], ids }) {
        query = query || (await this.getESFilter({ filter, ids }));

        try {
            let highlight = true;
            query = query.size(size);
            if (from) {
                query = query.from(from);
            }
            //query = await this.keepOnlyRequestedFields(ast, query);
            // query = await this.highlightFields(highlights, query);
            return query.toJSON();
        } catch (error) {
            console.error(error);
        }
    }

    async find(filter, { size = 100, from, query, highlights = [], ids, sortBy } = {}, partial) {
        query = query || (await this.getESFilter({ filter, ids }));

        try {
            let highlight = true;
            query = query.size(size);
            if (from) {
                query = query.from(from);
            }
            //query = await this.keepOnlyRequestedFields(ast, query);
            query = await this.highlightFields(highlights, query);
            const parseResults = result => {
                return result.hits.hits.map(d => {
                    let doc = {
                        ID: d._id,
                        Raw: d._source,
                        Score: d._score,
                        Highlights: d.highlight
                    };
                    doc = new Document(doc, this);

                    return doc;
                });
            };

            if (sortBy && (sortBy.Field || sortBy.Order)) {
                let { Field = "_score", Order } = sortBy;
                if (!Order) {
                    Order = Field === "_score" ? "DESC" : "ASC";
                }
                switch (Order) {
                    case "ASC":
                        query.sort(bob.sort(Field, "asc"));
                        break;
                    case "DESC":
                        query.sort(bob.sort(Field, "desc"));
                    case "RANDOM":
                        query.trackScores(true);
                        query.sort(
                            bob
                                .sort()
                                .type("number")
                                .script(bob.script("inline", "Math.random() * 200000").lang("painless"))
                                .order("asc")
                        );

                        break;
                    default:
                        break;
                }
            }

            if (partial) {
                return {
                    query: query.toJSON(),
                    parseResults: parseResults
                };
            }
            let result = await this.exec(query);
            return parseResults(result);
        } catch (error) {
            console.error(error);
        }
    }

    async getKeywords(
        filter,
        { field, size = 10, removeStop = true, discriminant = false, exclude, feature, tokenized, query, ids, include, ignore = [], split, ...rest },
        returnQuery = false
    ) {
        query = query || (await this.getESFilter({ filter, ids }));
        if (feature) {
            if (tokenized) {
                field = `__nlp__.${field}.${feature}`;
            } else {
                field = `__nlp__.${field}.${feature}.keyword`;
            }
        }

        let agg = bob.termsAggregation("keywords", field).size(size);
        if (discriminant && filter) {
            agg = bob.significantTermsAggregation("keywords", field).gnd();
        }

        if (include && include.length > 0) {
            size = Math.max(size, include.length);
            agg.include(include);
        } else {
            if (exclude) {
                ignore = [...exclude, ...ignore];
            }
            if (removeStop) {
                ignore = [...stopwordList, ...ignore];
            }

            if (ignore.length > 0) {
                agg.exclude(ignore);
            }
        }
        agg.size(size);

        if (split) {
            return this.split(split, query, agg, b => {
                return b.keywords.buckets.map(k => ({
                    Key: k.key,
                    Stat: k.doc_count,
                    KeyAsString: k.key,
                    OtherStats: console.log(k)
                }));
            });
        }

        query.agg(agg);
        if (returnQuery) {
            return {
                query: query.toJSON(),
                type: "KEYWORDS",
                selector: "aggregations.keywords.buckets"
            };
        }
        let result = await this.exec(query);

        result = result.aggregations.keywords.buckets.map(k => ({
            Key: k.key,
            Stat: k.doc_count,
            Count: k.doc_count,
            KeyAsString: k.key,
            Score: k.score,
            OtherStats: Object.keys(k)
                .filter(v => !new Set(["key", "doc_count", "score"]).has(v))
                .map(v => ({
                    Name: v,
                    Value: k[v]
                }))
        }));
        return result;
    }

    async values(filter, args) {
        let type = await this.getType(args.field);
        switch (type) {
            case "TEXT":
            case "CATEGORICAL":
                return this.getKeywords(filter, args);
                break;

            default:
                return this.histogram(filter, args);
                break;
        }
    }

    async getFieldTypeFromHost(fields) {
        let result = await this.client.indices.getFieldMapping({
            index: this.index,
            type: this.type,
            fields: fields
        });
        let data = get(result, [this.index, "mappings", this.type]);
        //getType(mapping[field].type, mapping[field]),
        data = fields.map(async f => {
            let fData = data[f];
            let last = f.split(".").slice(-1)[0];
            fData = get(fData, ["mapping", last]);
            return getType(fData.type, fData);
        });
        result = await Promise.all(data);
        return result;
    }

    getFieldAggregation(field, fieldType, { interval, format, ...params }) {
        switch (fieldType) {
            case "DATE": {
                interval = interval || "year";
                return bob.dateHistogramAggregation("histogram", field, interval).format(format || "yyyy");
            }

            case "INTEGER":
            case "DECIMAL": {
                interval = interval || 1;
                let agg = bob.histogramAggregation("histogram", field, interval);
                if (params.extended_bounds) {
                    agg.extendedBounds(params.extended_bounds.min, params.extended_bounds.max);
                }

                return agg;
            }

            default:
                break;
        }
    }

    async fieldStats(filter, { field, feature, query }) {
        query = query || (await this.getESFilter({ filter }));
        if (feature) {
            field = `__nlp__.${field}.${feature}`;
        }
        let agg = bob.statsAggregation("stats", field);
        query.agg(agg);
        let result = await this.exec(query);

        result = result.aggregations.stats;
        result.Max = result.max;
        result.Min = result.min;
        result.Avg = result.avg;
        result.Sum = result.sum;
        result.Count = result.count;
        return result;
    }

    async histogram2D(filter, { field, fieldX, fieldY, featureX, featureY, intervalX, intervalY, binsX, binsY, format, query }) {
        query = query || (await this.getESFilter({ filter }));
        fieldX = fieldX || field;
        fieldY = fieldY || field;
        if (featureX) fieldX = `__nlp__.${fieldX}.${featureX}`;
        if (featureY) fieldY = `__nlp__.${fieldY}.${featureY}`;

        let needStats = {};
        if (!intervalX) needStats["intervalX"] = fieldX;
        if (!intervalY) needStats["intervalY"] = fieldY;

        const stats = await Promise.all(
            Object.keys(needStats).map(field =>
                this.fieldStats(filter, {
                    field: needStats[field]
                }).then(result => ({
                    key: field,
                    result
                }))
            )
        );
        if (stats.length > 0) {
            for (let stat of stats) {
                if (stat.key === "intervalX") {
                    intervalX = ((stat.result.max - stat.result.min) / binsX).toFixed(2);
                }
                if (stat.key === "intervalY") {
                    intervalY = ((stat.result.max - stat.result.min) / binsY).toFixed(2);
                }
            }
        }

        let types = await this.getFieldTypeFromHost([fieldX, fieldY]);
        let aggX = await this.getFieldAggregation(fieldX, types[0], {
            interval: intervalX,

            format
        });

        let aggY = await this.getFieldAggregation(fieldY, types[1], {
            interval: intervalY,
            extended_bounds: {
                min: stats[1].result.min,
                max: stats[1].result.max
            },
            format
        });
        aggX.agg(aggY);
        query.agg(aggX);

        let result = await this.exec(query);
        return flatten(
            result.aggregations.histogram.buckets.map((x, idx) =>
                x.histogram.buckets.map((y, idy) => {
                    return {
                        IdxX: idx,
                        IdxY: idy,
                        KeyX: x.key,
                        KeyY: y.key,
                        Count: y.doc_count
                    };
                })
            )
        ).filter(d => d.Count > 0);
    }

    async histogram(filter, { field, interval, format, query, ids }) {
        query = query || (await this.getESFilter({ filter, ids }));

        let type = await this.getType(field);
        if (type === "DATE") {
            interval = interval || "year";
            let agg = bob.dateHistogramAggregation("histogram", field, interval).format(format || "yyyy");
            query.agg(agg);
        }
        if (type === "INTEGER") {
            let agg = bob.histogramAggregation("histogram", field, interval);
            query.agg(agg);
        }

        let result = await this.exec(query);
        return result.aggregations.histogram.buckets.map(d => ({
            Key: d.key,
            KeyAsString: d.key_as_string,
            Stat: d.doc_count
        }));
    }

    async AdjMatrix(filter, { field, size, discriminant = false, exclude, values, ids, query, labelFilters }) {
        query = query || (await this.getESFilter({ filter, ids }));
        let groups = {};
        if (labelFilters && labelFilters.length > 1) {
            let filters = await Promise.all(
                labelFilters.map(labelFilter => {
                    return this.parseFilter(labelFilter.Filter);
                })
            );

            labelFilters.forEach((labelFilter, idx) => {
                if (filters[idx]) {
                    groups[labelFilter.Name] = filters[idx];
                }
            });
        } else if (!values) {
            let vquery = this.copyQuery(query);
            let result = await this.values(filter, {
                field,
                size,
                discriminant,
                exclude
            });
            values = result.map(k => k.Key);
            groups = values.reduce(
                (prev, curr) => ({
                    ...prev,
                    [isArray(curr) ? curr.join("||") : curr]: bob.termsQuery(field, curr)
                }),
                {}
            );
        }

        if (Object.keys(groups).length === 0) {
            throw "No groups created";
        }

        const agg = bob
            .adjacencyMatrixAggregation("interactions")
            .filters(groups)
            .separator("&&");
        query.agg(agg);
        query.size(0);

        let result = await this.exec(query);
        result = result.aggregations.interactions.buckets;
        let nodes = orderBy(result.filter(n => n.key.indexOf("&&") === -1).map(n => ({ Key: n.key, Count: n.doc_count })), "Count", "desc");
        let links = orderBy(result.filter(n => n.key.indexOf("&&") > -1).map(n => ({ Key: n.key.split("&&"), Count: n.doc_count })), "Count", "desc");

        return { Nodes: nodes, Links: links };
    }
}

const DYNAMIC_TAMPLATES = [
    {
        strings: {
            match_mapping_type: "string",
            mapping: {
                type: "keyword"
            }
        }
    }
];

const BASE_SETTINGS = {
    index: {
        analysis: {
            filter: {
                english_keywords: {
                    keywords: ["waitress"],
                    type: "keyword_marker"
                },
                english_stemmer: {
                    type: "stemmer",
                    language: "english"
                },
                light_stemmer_: {
                    name: "minimal_english",
                    type: "stemmer"
                },
                my_snow: {
                    type: "snowball",
                    language: "English"
                },
                english_stop: {
                    type: "stop",
                    stopwords: stopwordList
                },
                english_shingle: {
                    max_shingle_size: "2",
                    min_shingle_size: "2",
                    output_unigrams: "false",
                    type: "shingle"
                },
                english_possessive_stemmer: {
                    type: "stemmer",
                    language: "possessive_english"
                }
            },
            char_filter: {
                html: {
                    type: "html_strip"
                }
            },
            analyzer: {
                base: {
                    filter: ["english_possessive_stemmer", "lowercase", "english_stop", "light_stemmer_"],
                    char_filter: ["html"],
                    tokenizer: "standard"
                },
                keepstops: {
                    filter: ["english_possessive_stemmer", "lowercase", "light_stemmer_"],
                    char_filter: ["html"],
                    tokenizer: "standard"
                }
            }
        }
    }
};

module.exports = Elasticsearch;
