const loki = require("lokijs");
const lfsa = require("lokijs/src/loki-fs-structured-adapter.js");

const { User } = require("../entities/user");
const { Dataset } = require("../entities/dataset");

function wrapType(Type) {
    class LokiRowType extends Type {
        constructor(document) {
            if (!document) {
                super(null);
            } else {
                let newDoc = JSON.parse(JSON.stringify(document));
                newDoc.ID = newDoc.$loki;
                delete newDoc.meta;
                delete newDoc.$loki;
                super(newDoc);
            }
        }
    }
    return LokiRowType;
}

const COLLECTIONS = [
    { name: "users", unique: ["Email"], type: wrapType(User) },
    { name: "datasets", unique: ["Name"], type: wrapType(Dataset) }
];

class LokiDB {
    constructor(config) {
        const adapter = new lfsa();
        this.db = new Promise((resolve, reject) => {
            const adapter = new lfsa();
            try {
                const db = new loki(config.data_file, {
                    adapter: adapter,
                    autoload: true,
                    autoupdate: false,
                    autoloadCallback: () => resolve(db),
                    autosave: true,
                    autosaveInterval: 1000
                });
            } catch (error) {
                reject(error);
            }
        });

        this.db.then(db => {
            for (let collection of COLLECTIONS) {
                let lokiCollection = db.getCollection(collection.name);
                if (!lokiCollection) {
                    lokiCollection = db.addCollection(collection.name, {
                        unique: collection.unique
                    });
                }
                this[collection.name] = new LokiCollection(
                    lokiCollection,
                    this,
                    collection.type
                );
            }
        });
        this.ready = this.db.then(d => true);
    }
    async close() {
        let db = await this.db;
        db.close();
    }
}

class LokiCollection {
    constructor(collection, db, Type) {
        this.collection = collection;
        this.db = db;
        this.Type = Type;
    }
    create(document, ID) {
        let result = this.collection.insert(document);
        return new this.Type(result);
    }

    async by(field, value) {
        let result = await this.collection.by(field, value);
        return new this.Type(result);
    }

    async delete(ID) {
        let doc = await this.collection.get(ID);
        if (!doc) throw new Error(`Item width ID: ${ID} not found`);
        let result = await this.collection.remove(doc);
        return !!result;
    }

    async get(ID) {
        let result = await this.collection.get(ID);
        return new this.Type(result);
    }

    find() {
        let result = this.collection.find().map(d => new this.Type(d));
        return this.collection.find().map(d => new this.Type(d));
    }

    async update(document) {
        if (document.toPlain) {
            document = document.toPlain();
        }
        let result = await this.collection.update(document);
        return result;
    }
}

module.exports = LokiDB;
