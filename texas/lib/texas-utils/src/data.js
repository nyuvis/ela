function withDataProperties(dataClass, properties) {
    obj = dataClass.prototype;
    for (let property of properties) {
        if (!obj[property]) {
            Object.defineProperty(obj, property, {
                get: function() {
                    return this.data[property];
                },
                set: function(newValue) {
                    this.data[property] = newValue;
                }
            });
        }
    }
    return dataClass;
}

module.exports = {
    withDataProperties
};
