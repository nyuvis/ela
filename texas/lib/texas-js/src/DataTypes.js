const DataType = {
    CATEGORICAL: "CATEGORICAL",
    TEXT: "TEXT",
    DATE: "DATE",
    INTEGER: "INTEGER",
    DECIMAL: "DECIMAL"
};

function parseValue(value, type) {
    switch (type) {
        case DataType.TEXT:
        case DataType.CATEGORICAL:
            return value;
        case DataType.DATE:
            return new Date(value);
        case DataType.DECIMAL:
            return parseFloat(value);
        case DataType.INTEGER:
            return parseInt(value);

        default:
            break;
    }
}

module.exports = { parseValue, DataType };
