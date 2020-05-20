const fs = require("fs");
const { makeExecutableSchema } = require("graphql-tools");
const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
const { ApolloServer } = require("apollo-server");
const { gql } = require("apollo-server-express");
class TexasGQL {
    constructor(client) {
        this.client = client;
        this.schema = makeExecutableSchema({
            typeDefs: this.types,
            resolvers: this.resolvers,
            logger: console
        });

        this.server = this.server.bind(this);
        this.graphiql = this.graphiql.bind(this);
    }

    get resolvers() {
        if (!this._resolvers) {
            this._resolvers = require("./resolvers")(this.client);
        }
        return this._resolvers;
    }

    get types() {
        if (!this._types) {
            this._types = [];
            let files = fs.readdirSync(__dirname + "/types");
            for (let file of files) {
                let content = fs.readFileSync(__dirname + "/types/" + file);
                this._types.push(content.toString());
            }
        }
        return gql(this._types.join("\n"));
    }

    server() {
        return new ApolloServer({
            cors: {
                origin: true,           
                credentials: true
            },  
            typeDefs: this.types,
            resolvers: this.resolvers,
            context: async ({ req, connection, payload }) => {
                let user = undefined;
                let token = "";
                if (req && req.headers.authorization && req.headers.authorization != "undefined") {
                    token = req.headers.authorization || "";
                } else if (connection && connection.context.authorization != "undefined") {
                    token = connection.context.authorization || "";
                }

                token = token.replace("JWT ", "");

                let contextData = {
                    client: this.client
                };
                if (token) {
                    user = await this.client.manager.validateJWT(token);
                    contextData.user = user;
                }

                return contextData;
            },
            playground: {
                endpoint: `http://localhost:4200/graphql`,
                settings: {
                    "editor.theme": "ligth",
                    "editor.cursorShape": "block"
                }
            }
        });
    }

    graphiql_old(apiUrl) {
        return graphiqlExpress({
            endpointURL: apiUrl
        });
    }
    graphiql(apiUrl) {
        return (req, res) => {
            switch (req.url) {
                case "/graphiql.js":
                case "/graphiql.css":
                    res.sendFile("graphiql" + req.url, { root: __dirname });
                    break;

                default:
                    res.sendFile("graphiql/index.html", { root: __dirname });
                    break;
            }
        };
    }
}

module.exports = TexasGQL;
