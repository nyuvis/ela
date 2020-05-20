const prompt = require("prompt");
const yargs = require("yargs");
const utils = require("texas-utils");
const Texas = require("texas-js");

const config = utils.config();
let texas = new Texas(config);

yargs
    .usage("$0 <cmd> [args]")
    .command("addUser", "Add a user to the system!", yargs => {}, function(
        argv
    ) {
        const schema = {
            properties: {
                Name: {
                    pattern: /^[a-zA-Z\s\-]+$/,
                    description: "Name",
                    message: "Name must be only letters, spaces, or dashes",
                    required: true
                },
                Email: {
                    description: "Email",
                    type: "string",
                    required: true
                },
                Password: {
                    description: "Password",
                    type: "string",
                    replace: "*",
                    hidden: true,
                    required: true
                },
                Groups: {
                    description: "Groups",
                    type: "string"
                }
            }
        };
        prompt.start();
        prompt.message = null;
        prompt.get(schema, async function(err, result) {
            try {
                result.Groups = result.Groups.split(",").map(d => d.trim());
                let user = await texas.manager.createUser(result);
            } catch (err) {
                console.error(err.message);
            }
            prompt.stop();
            texas.manager.close();
        });
    })
    .help().argv;
