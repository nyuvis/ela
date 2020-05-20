const { DatasetType } = require("./data");
const { astToJson, findKeys } = require("../utils");
async function createStore(args, context, ast) {
    const { client } = context;
    return client.store.createStore(args);
}

async function addCollection(args, context, ast) {
    const { client } = context;
    return client.store.addCollection(args);
}

async function getCollection({ storeID, ID, restrictToUser }, context, ast) {
    let result = await context.client.store.getCollection({
        storeID,
        collectionID: ID,
        restrictToUser
    });
    return DatasetType(result, context);
}

const Stores = async (obj, qArgs, context, ast) => {
    let data = await context.client.store.getStores();

    return data.map(s => ({
        ...s,
        Collections: (args, context, ast) =>
            context.client.store.getCollections({ ...args, storeID: s.ID }),
        Collection: (args, context, ast) =>
            getCollection({ ...args, storeID: s.ID }, context, ast)
    }));

    return context.client.store.getStores();
};
module.exports = {
    Stores,
    Query: async (obj, qArgs, context, ast) => {
        let storeID = qArgs.ID;
        let fields = astToJson(ast);
        let dataFields = false;

        for (let f of ["ID", "Name"]) {
            let k = findKeys(f, fields[":Store"]);
            if (k.length > 0) {
                dataFields = true;
                break;
            }
        }
        let data = {};
        if (dataFields) {
            data = await context.client.store.getStoreData(storeID);
        }

        return {
            ...data,
            Collections: (args, context, ast) =>
                context.client.store.getCollections({ ...args, storeID }),
            Collection: (args, context, ast) =>
                getCollection({ ...args, storeID }, context, ast)
        };
    },
    Mutations: {
        createStore,
        addCollection,
        Collection: async (cArgs, context, ast) => {
            let collectionInfo = await getCollection(cArgs, context, ast);
            if (collectionInfo.userRestricted) {
                if (!context.user)
                    throw "User is required to access this collection";
            }
            return {
                addOrUpdateMany: (args, context, ast) => {
                    if (collectionInfo.userRestricted) {
                        if (context.user.Type === "GUEST") {
                            args.documents = args.documents.map(d => ({
                                ...d,
                                data: {
                                    ...d.data,
                                    _userID: context.user.Guest,
                                    _userType: "GUEST"
                                }
                            }));
                        }
                    }

                    return context.client.store.addOrUpdateManyDocuments({
                        storeID: cArgs.storeID,
                        collectionID: cArgs.ID,
                        ...args
                    });
                },
                addOrUpdate: (args, context, ast) => {
                    if (collectionInfo.userRestricted) {
                        if (context.user.Type === "GUEST") {
                            args.document._userID = context.user.Guest;
                            args.document._userType = "GUEST";
                        }
                    }

                    return context.client.store.addOrUpdateDocument({
                        storeID: cArgs.storeID,
                        collectionID: cArgs.ID,
                        ...args
                    });
                }
            };
        }
    }
};

/*
Collection: (cArgs, context, ast) => {
            addOrUpdate: (args, context, ast) =>
                store.addOrUpdateDocument({
                    storeID: sArgs.ID,
                    collectionID: cArgs.ID,
                    ...args
                });
        }*/
