const fs = require("fs");
const yaml = require("js-yaml");

function replaceVariables(obj) {
    if (typeof obj === "object") {
        for (let key of Object.keys(obj)) {
            obj[key] = replaceVariables(obj[key]);
        }
    }
    if (typeof obj === "string") {
        while (true) {
            const regex = /\$([\w_]+)/g;
            let match = regex.exec(obj);
            if (!match) break;
            let value = match[0];
            let variable = match[1];
            obj = obj.replace(value, process.env[variable]);
        }
    }
    return obj;
}

module.exports = config_path => {
    config_path = config_path || `${process.env.CONFIG_PATH}/default.yml`;
    config = replaceVariables(
        yaml.safeLoad(fs.readFileSync(config_path, "utf8"))
    );
    return config;
};
