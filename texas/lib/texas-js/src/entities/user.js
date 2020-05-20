const { data: { withDataProperties } } = require("texas-utils");

class User {
    constructor(data) {
        this.data = data || {};
    }
}

module.exports = {
    User: withDataProperties(User, ["ID", "Name", "Groups", "Email", "Password"])
};
