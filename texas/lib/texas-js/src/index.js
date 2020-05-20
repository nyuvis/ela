class TexasJS {
    constructor(config) {
        this.config = config;
        this.loadModules(config.modules);
    }

    loadModules(config) {
        for (let module_name of Object.keys(config)) {
            let Module = require(`./modules/${module_name}`);
            this[module_name] = new Module(config[module_name], this);
        }
    }
}

module.exports = TexasJS;
