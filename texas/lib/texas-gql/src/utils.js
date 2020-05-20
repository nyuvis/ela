const { pick, omit, pickBy, isArray } = require("lodash");

function arrayToMap(arr, key, val = v => v) {
    return arr.reduce((map, obj) => {
        let objKey = key(obj);
        map[objKey] = val(obj);
        return map;
    }, {});
}

function astToJson(ast) {
    try {
        let result = {};
        let variables = ast.variableValues;
        function parseArgument(fieldAst, variables) {
            let result = {};

            return parseAst(fieldAst.value, result);
        }

        function parseField(fieldAst, variables) {
            let result = null;
            if (fieldAst.selectionSet) {
                result = result || {};
                for (let selection of fieldAst.selectionSet.selections) {
                    parseAst(selection, result);
                }
            }
            if (fieldAst.arguments && fieldAst.arguments.length > 0) {
                result = result || {};
                let __arguments = {};
                for (let arg of fieldAst.arguments) {
                    parseAst(arg, __arguments);
                }
                result.__arguments = __arguments;
            }
            return result;
        }

        function parseAst(ast, root = {}) {
            if (!ast.name) {
                switch (ast.kind) {
                    case "StringValue":
                        return ast.value;
                    case "IntValue":
                        return +ast.value;
                    case "ListValue":
                        return ast.values.map(parseAst);
                        break;
                    case "ObjectValue":
                        let result = {};
                        for (let field of ast.fields) {
                            let key = field.name.value;
                            let value = parseAst(field.value);
                            result[key] = value;
                        }
                        return result;
                    case "BooleanValue":
                        return ast.value;
                    default:
                        console.error(
                            `I don't know the ${
                                ast.kind
                            } Kind, And don't have a name`
                        );
                        return null;
                }
            }
            let key = "";
            let result = {};
            if (ast.alias) {
                key += ast.alias.value;
            }
            key += ":" + ast.name.value;

            switch (ast.kind) {
                case "Field":
                    root[key] = parseField(ast);
                    return root;
                    break;

                case "Argument":
                    root[ast.name.value] = parseArgument(ast);
                    return root;
                    break;

                case "Variable":
                    return variables[ast.name.value];
                    break;
                default:
                    console.error(`I don't know the ${ast.kind} Kind`);
                    break;
            }
            return root;
        }

        for (let field of ast.fieldNodes) {
            parseAst(field, result);
        }

        return result;
    } catch (error) {
        console.error(error);
    }
}

const COMPOUND_FILTERS = ["and", "or", "not"];

function parseFilters(filter) {
    let compound = pick(filter, COMPOUND_FILTERS);
    compound = pickBy(compound, v => v && v.length > 0);
    let ids = filter.ids;
    let logical = omit(filter, [...COMPOUND_FILTERS, "ids"]);
    logical = Object.keys(logical).length > 0 ? logical : undefined;

    if (logical) {
        if (logical.query && !isArray(logical.query)) {
            logical.query = [logical.query];
        }
        logical["$type"] = "logical";
    }

    if (ids) {
        return { ids, $type: "id" };
    }
    if (Object.keys(compound).length > 0) {
        for (let key of Object.keys(compound)) {
            compound[key] = compound[key].map(parseFilters);
            if (logical) {
                compound[key].push(logical);
            }
        }
        compound["$type"] = "compound";
        return compound;
    } else {
        return logical;
    }
}

function findKeys(key, JSONAst) {
    candidates = Object.keys(JSONAst).filter(k => k.endsWith(":" + key));
    return candidates;
}

module.exports = {
    astToJson,
    findKeys,
    parseFilters,
    arrayToMap
};
