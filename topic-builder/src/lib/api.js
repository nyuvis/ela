import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";
import { get, isPlainObject, isArray } from "lodash";

const authLink = setContext((_, { headers }) => {
    const token = sessionStorage.getItem("expl-token");

    return {
        headers: {
            ...headers,
            authorization: token ? `JWT ${token}` : ""
        }
    };
});

export function cleanResult(data, path) {
    if (path && path.length > 0) {
        data = get(data, path);
    }
    let result = {};
    if (isArray(data)) {
        return (data = data.map(cleanResult));
    } else {
        for (let field in data) {
            if (field !== "__typename") {
                let value = data[field];
                if (isPlainObject(value)) {
                    value = cleanResult(value);
                } else if (isArray(value)) {
                    value = value.map(cleanResult);
                }
                result[field] = value;
            }
        }
    }
    return result;
}

export const client = new ApolloClient({
    shouldBatch: true,
    link: authLink.concat(new HttpLink({ uri: process.env.REACT_APP_API_URL })),
    cache: new InMemoryCache()
});

export const getClient = () => client;
