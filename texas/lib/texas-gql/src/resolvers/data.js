const { get } = require("lodash");
const { astToJson, findKeys, parseFilters, arrayToMap } = require("../utils");

function getUserId(user) {
    if (user.Type === "GUEST") return user.Guest;
    return user.ID;
}

async function Split(filter, args, dataset, ast) {
    let astJSON = astToJson(ast, true);
    if (args.filters) {
        args.filters = args.filters.map(a => ({
            ...a,
            Filter: parseFilters(a.Filter)
        }));
    }
    let resolvers = {
        Size() {
            return dataset.db.count(filter, { split: args });
        },
        Values(localArgs) {
            return dataset.db.values(filter, {
                split: args,
                ...localArgs.__arguments
            });
        }
    };
    let splitKey = findKeys("Split", astJSON)[0];
    let splitJSON = astJSON[splitKey];

    let cache = {};
    let calls = [];
    for (let key in splitJSON) {
        let command = key.split(":")[1];
        if (resolvers[command]) {
            let commandCall = resolvers[command](splitJSON[key]);
            commandCall.then(r => {
                //cache[key] = arrayToMap(r, r => r.Key, r => r.result);
                cache[key] = r;
            });
            calls.push(commandCall);
        }
    }

    await Promise.all(calls);

    function getter(key) {
        return (args, context, ast) => {
            let alias = get(ast, "fieldNodes[0].alias.value") || "";
            let name = get(ast, "fieldNodes[0].name.value");
            let cmdKey = `${alias}:${name}`;
            if (cache[cmdKey]) {
                return cache[cmdKey][key];
            }
        };
    }

    if (args.filters) {
        return args.filters.map(f => {
            let result = { Key: f.Key };
            let commandFields = ["Size", "Values"];
            for (let command of commandFields) {
                result[command] = getter(f.Key);
            }
            return result;
        });
    }
    return null;
}
const ADMINS = new Set(["cristian.felix@nyu.edu"]);
function isAdmin(user) {
    if (user && ADMINS.has(user.Guest)) {
        return true;
    }
    return false;
}

function Select(args, { client }, ast, dataset, context) {
    if (dataset.userRestricted) {
        if (!context.user) {
            throw new Error("User is required to access this collection");
        } else {
            if (dataset.restrictToUser === false && isAdmin(context.user)) {
                console.log("Skip");
            } else {
                if (args.filter) {
                    args.filter = {
                        and: [
                            { field: "_userID", eq: getUserId(context.user) },
                            args.filter
                        ]
                    };
                } else {
                    args.filter = {
                        field: "_userID",
                        eq: getUserId(context.user)
                    };
                }
            }
        }
    }
    if (args.filter) {
        args.filter = parseFilters(args.filter);
    }

    let filter = args.filter;
    let gArgs = args;

    return {
        NativeQuery: async args =>
            JSON.stringify(
                await dataset.db.getNativeQuery(filter, {
                    ...args,
                    ids: gArgs.ids
                })
            ),
        Documents: (args, context, ast) => {
            let astJSON = astToJson(ast, true);
            let docFields = astJSON[findKeys("Documents", astJSON)[0]];
            let highlights = findKeys("Highlight", docFields).map(
                key =>
                    docFields[key].__arguments && {
                        field: docFields[key].__arguments["ID"],
                        highlight: docFields[key].__arguments["highlight"],
                        numFragments: docFields[key].__arguments["numFragments"]
                    }
            );

            return dataset.db.find(filter, {
                ...args,
                highlights,
                ids: gArgs.ids
            });
        },
        Size: args => dataset.db.count(filter, { ids: args.ids }),
        CountDistinct: args => {
            return dataset.db.countDistinct(filter, args);
        },
        Values: args => {
            return dataset.db.values(filter, args).then(r => {
                return r;
            });
        },
        Histogram: args => {
            return dataset.db.histogram(filter, args).then(r => {
                return r;
            });
        },
        AdjMatrix: args => {
            if (args.labelFilters) {
                args.labelFilters = args.labelFilters.map(a => ({
                    ...a,
                    Filter: parseFilters(a.Filter)
                }));
            }
            return dataset.db.AdjMatrix(filter, args);
        },
        Histogram2D: (args, context, ast) => {
            return dataset.db.histogram2D(filter, args).then(r => {
                return r;
            });
        },
        FieldStats: (args, context, ast) => {
            return dataset.db.fieldStats(filter, args).then(r => {
                return r;
            });
        },
        Split: (args, context, ast) => Split(filter, args, dataset, ast),
        NLP: args => ({
            TopicModel: async args => {
                let datasetname = dataset.data.Name.replace(/\s/g, "");
                let datasource = dataset.data;
                let { query } = await dataset.db.find(
                    filter,
                    { ids: gArgs.ids },
                    true
                );
                let { field, params, ...method } = args;
                method = { ...method, ...params };

                let datasource_info = {
                    type: datasource.Provider,
                    name: datasetname,
                    field: field,
                    connection: datasource.Config
                };

                return client.nlp.GetTopicModel(method, {
                    datasource_info,
                    dataset,
                    filter,
                    field
                });
            },
            Projection: args => {
                return client.nlp.Projection(
                    dataset.ID,
                    args.method,
                    args.field
                );
            }

            // KeywordTopics: async ({ field, params = {} }) => {
            //     let datasetname = dataset.data.Name.replace(/\s/g, "");
            //     let datasource = dataset.data;
            //     let {
            //         query,
            //         selector,
            //         type: query_type
            //     } = await dataset.db.getKeywords(
            //         filter,
            //         {
            //             field,
            //             size: 10000,
            //             removeStop: true,
            //             discriminant: true
            //         },
            //         true
            //     );

            //     return client.nlp.KeywordTopics(
            //         { text_field: field, dataset: datasetname, ...params },
            //         { datasource, query, selector }
            //     );
            // }
        })
    };
}

function DatasetType(dataset, context) {
    dataset.Select = (args, { client }, ast) =>
        Select(args, { client }, ast, dataset, context);

    dataset.Document = (args, { client }, ast) => {
        return dataset.db.get(args);
    };

    dataset.Schema = () => dataset.db.Schema();
    return dataset;
}

module.exports = { DatasetType };
