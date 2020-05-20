const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");

/* 
The MIT License (MIT)
Copyright (c) 2016 Jimmy Jia
Based on: https://github.com/taion/graphql-type-json
*/
const GraphQLJSON = new GraphQLScalarType({
    name: "JSON",
    description:
        "The `JSON` scalar type represents JSON values as specified by " +
        "[ECMA-404](http://www.ecma-international.org/" +
        "publications/files/ECMA-ST/ECMA-404.pdf).",
    serialize: value => {
        if (typeof value === "object") {
            return value;
        }
        return JSON.parse(value);
    },
    parseValue: value => {
        return value;
    },
    parseLiteral: ast => {
        switch (ast.kind) {
            case Kind.STRING:
            case Kind.BOOLEAN:
                return ast.value;
            case Kind.INT:
            case Kind.FLOAT:
                return parseFloat(ast.value);
            case Kind.OBJECT: {
                const value = Object.create(null);
                ast.fields.forEach(field => {
                    value[field.name.value] = parseLiteral(field.value);
                });

                return value;
            }
            case Kind.LIST:
                return ast.values.map(parseLiteral);
            default:
                return null;
        }
    }
});

const DynScalar = new GraphQLScalarType({
    name: "DynScalar",
    description: "Dynamic typed result",
    serialize: value => {
        return value;
    },
    parseValue: value => {
        return value;
    },
    parseLiteral: ast => {
        return ast.value;
    }
});

module.exports = {
    JSON: GraphQLJSON,
    DynScalar: DynScalar
};
