const { DatasetType } = require("../resolvers/data");

function User(obj, args, contex, ast) {
    return contex.user;
}

function Users(obj, args, context, ast) {
    const { client, user } = context;
    return client.manager.Users(user);
}

async function Dataset(obj, { ID }, context, ast) {
    const { client, user } = context;
    let startTime = new Date();
    let dataset = await client.manager.Dataset(user, ID).then(async dataset => {
        let result = await DatasetType(dataset);
        return result;
    });
    return dataset;
    //return DatasetType(dataset);
}

function Datasets(obj, args, context, ast) {
    const { client, user } = context;
    return client.manager.Datasets(user);
}

//------------------------------------------------------------------------------
async function deleteDataset({ ID }, context, ast) {
    const { client, user } = context;
    return client.manager.deleteDataset(user, ID);
}

//------------------------------------------------------------------------------

function createUser(args, context, ast) {
    const { client } = context;
    return client.manager.createUser(args.user);
}

async function signIn(args, context, ast) {
    const { client } = context;
    let user = client.manager.signIn(args.email, args.password);
    return user;
}

async function guestSession(args, context, ast) {
    const { client } = context;
    let user = client.manager.guestSession(args.guest);
    return user;
}

async function createDataset({ dataset }, context) {
    const { client } = context;
    let result = client.manager.createDataset(context.user, dataset);
    return result;
}

function resetPassword({ email, password, newPassword }, context, ast) {
    const { client } = context;
    let user = client.manager.signIn(args.email, args.password);
    return user;
}

async function addGroupUser({ email, group }, context, ast) {
    const { client } = context;
    let user = client.manager.addGroupUser(email, group);
    return user;
}

module.exports = {
    User,
    Users,
    Dataset,
    Datasets,

    //Mutations Users
    createUser,
    signIn,
    addGroupUser,
    guestSession,

    //Mutations Dataset
    createDataset,
    deleteDataset
};
