const { parseValue, DataType } = require("../DataTypes");
const { data: { withDataProperties } } = require("texas-utils");

class Document {
    constructor(data, provider) {
        this.data = data || {};
        this.provider = provider;
    }
    async FieldStats({ fieldID }) {
        let result = await this.provider.FieldStats({ ID: this.ID, fieldID });
        return result;
    }

    async Highlight({ ID }) {
        let highlight = this.data.Highlights || {};
        return highlight[ID];
    }

    async Field({ name, ID, type }) {
        if (!type && ID) {
            const schema = await this.provider.Schema();
            type = schema.IndexID[ID].Type;
        } else if (!type && name) {
            const schema = await this.provider.Schema();
            type = schema.IndexName[name].Type;
        }
        if (!type) {
            type = DataType.CATEGORICAL;
        }

        if (!ID) {
            const schema = await this.provider.Schema();
            ID = schema.IndexName[name].ID;
        }

        return parseValue(this.Raw[ID], type);
    }
}

module.exports = {
    Document: withDataProperties(Document, ["ID", "Raw", "Score"])
};
