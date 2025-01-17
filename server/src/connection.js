const elasticsearch = require('elasticsearch')

// Core ES variable for this project
let index;
let type;
const port = 9200;
const host = process.env.ES_HOST || 'localhost';
const requestTimeout = 60000
const client = new elasticsearch.Client({ host: { host, port  }, requestTimeout });

// Check the ES connection status

async function checkConnection () {
  let isConnected = false;
  while (!isConnected) {
    console.log('Connecting to ES');
    try {
      const health = await client.cluster.health({})
      console.log(health);
      isConnected = true;
    } catch (err) {
      console.log('Connection Failed, Retrying...', err);
    }
  }
}

// Clear the index, recreate it and add mappings
async function resetIndex (index, type, stopwordlist) {
  index = index;
  type = type;
  if (await client.indices.exists({ index })) {
    await client.indices.delete({ index })
  }
  await client.indices.create({ 
    index,
    body : {
      settings: {
        "analysis": {
          "analyzer": {
            "std_english": { 
              "type":      "standard",
              "ignore_case": true,
              "stopwords": ["_english_", ...stopwordlist]
            }
          }
        }
      }
    }
  })
  await putDataMapping(index, type)
}

async function putDataMapping (index, type) {
  const schema = {
    location: { type: 'integer' },
    text: { type: 'text' , analyzer: "std_english", "fielddata": true },
    __nlp__: {
      properties: {
        text: {
          properties: {
            projection_point: {
              properties: {
                x: {
                  type: "float"
                },
                y: {
                  type: "float"
                }
              }
            }
          }
        }
      }
    }
  }
  return client.indices.putMapping({ index, type, body: { properties: schema }})
}

module.exports = {
  client, index, type, checkConnection, resetIndex
}