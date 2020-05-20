const scalar = require("./scalar");
const manager = require("./manager");
const store = require("./store");

const { PubSub } = require("apollo-server");
const pubsub = new PubSub();

module.exports = client => ({
    ...scalar,
    Query: {
        User: manager.User,
        Users: manager.Users,
        Dataset: manager.Dataset,
        Datasets: manager.Datasets,
        Store: store.Query,
        Stores: store.Stores
    },
    Subscription: {
        tickTock: {
            subscribe: () => pubsub.asyncIterator(["TICK_TOCK"])
        }
    },
    Mutation: {
        System: () => ({
            createUser: manager.createUser,
            signIn: manager.signIn,
            guestSession: manager.guestSession,
            addGroupUser: manager.addGroupUser,
            createDataset: manager.createDataset,
            deleteDataset: manager.deleteDataset
        }),
        Store: (obj, sArgs) => ({
            ...store.Mutations,
            addCollection: (args, context, ast) =>
                store.Mutations.addCollection({ ...args, storeID: sArgs.ID }, context, ast),
            Collection: (args, context, ast) =>
                store.Mutations.Collection({ storeID: sArgs.ID, ...args }, context, ast)
        })
    }
});

setInterval(() => {
    pubsub.publish("TICK_TOCK", { tickTock: new Date().toTimeString() });
}, 1000);
