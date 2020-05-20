const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const API = require("texas-gql");
const Texas = require("texas-js");
const utils = require("texas-utils");

const config = utils.config();
let texas = new Texas(config);
let api = new API(texas);

let server = api.server();

api.server()
    .listen(process.env.API_PORT)
    .then(({ url, subscriptionsUrl }) => {
        console.log(`🚀 Server ready at ${url}`);
        console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
    });
