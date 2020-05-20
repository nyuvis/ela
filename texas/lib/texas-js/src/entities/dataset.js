const { data: { withDataProperties } } = require("texas-utils");

class Dataset {
    constructor(data) {
        this.data = data || {};
    }

    get db() {
        if (!this._db && this.data.Provider) {
            let Connector = require(`../connectors/${this.data.Provider.toLowerCase()}`);
            this._db = new Connector(this.Config);
        }
        return this._db;
    }
}

module.exports = {
    Dataset: withDataProperties(Dataset, ["ID", "Name", "Provider", "Config"])
};
