const { kebabCase, get } = require("lodash");
const { Dataset } = require("../entities/dataset");
class Store {
    constructor(config, client) {
        this.DBClient = require(`../connectors/${config.connector.name}`);
        this.config = config;
        this.dataClient = this.getClient();
        this.dataClient.createRepository(this.config.prefix);
    }
    getClient() {
        let config = { ...this.config.connector.config };
        console.log("Client Config", JSON.stringify(config, null, 4));
        let client = new this.DBClient(config);
        return client;
    }
    async createStore({ store }) {
        let storeId = store.ID;
        let client = this.getClient();
        if (!storeId) {
            storeId = store.Name;
            storeId = kebabCase(storeId);
        }
        let fullStoreId = `${this.config.prefix}.${storeId}`;
        await client.createRepository(fullStoreId);
        store.ID = storeId;

        await this.dataClient.withIndex({ index: this.config.prefix, type: "document" }, client => {
            return client.create(store, storeId);
        });
        return store;
    }

    async getStores() {
        let data = await this.dataClient.withIndex({ index: this.config.prefix, type: "document" }, client => {
            return client.find();
        });
        return data.map(d => get(d, ["data", "Raw"]));
    }

    async getStoreData(storeID) {
        let data = await this.dataClient.get({ ID: storeID });
        return get(data, ["data", "Raw"]);
    }

    async getCollections({ storeID }) {
        storeID = kebabCase(storeID);
        let fullStoreId = `${this.config.prefix}.${storeID}`;
        let client = this.getClient();
        client.setRepository(fullStoreId);
        let result = await client.find();
        return result.map(d => get(d, ["data", "Raw"]));
    }

    async getCollection({ collectionID, storeID, restrictToUser }) {
        storeID = kebabCase(storeID);
        collectionID = kebabCase(collectionID);
        let fullStoreId = `${this.config.prefix}.${storeID}`;
        let fullCollectionId = `${this.config.prefix}.${storeID}.${collectionID}`;
        let client = this.getClient();
        client.setRepository(fullStoreId);
        let result = await client.get({ ID: collectionID });
        client.setRepository(fullCollectionId);
        let config = client.getConfig();

        let dataset = new Dataset({
            ID: result.data.Raw.ID,
            Name: result.data.Raw.Name,
            ...config
        });
        dataset.userRestricted = result.data.Raw.userRestricted;
        dataset.restrictToUser = restrictToUser;
        return dataset;
    }

    async addCollection({ collection, storeID }) {
        storeID = kebabCase(storeID);
        let collectionId = collection.ID;
        if (!collectionId) {
            collectionId = kebabCase(collection.Name);
        }
        let fullStoreId = `${this.config.prefix}.${storeID}`;
        let fullCollectionId = `${fullStoreId}.${collectionId}`;

        let client = this.getClient();
        await client.createRepository(fullCollectionId);

        client.setRepository(fullStoreId);
        collection.ID = collectionId;
        client.create(collection, collectionId);

        return collection;
    }

    getFullCollectionID(storeID, collectionID) {
        storeID = kebabCase(storeID);
        collectionID = kebabCase(collectionID);
        return `${this.config.prefix}.${storeID}.${collectionID}`;
    }

    async addOrUpdateDocument({ storeID, collectionID, document, ID }) {
        let fullCollectionID = this.getFullCollectionID(storeID, collectionID);
        let client = this.getClient();
        client.setRepository(fullCollectionID);
        return client.createOrUpdate(document, ID);
    }

    async addOrUpdateManyDocuments({ storeID, collectionID, documents }) {
        let fullCollectionID = this.getFullCollectionID(storeID, collectionID);
        let client = this.getClient();
        client.setRepository(fullCollectionID);
        return client.createOrUpdateMany(documents);
    }
}
module.exports = Store;
