const fs = require("fs");

const file = fs.readFileSync(__dirname + "/stopwords.lst");
const list = file.toString().split("\n");

const index = list.reduce((prev, curr) => ({ ...prev, [curr]: true }), {});

module.exports = { list, index };
