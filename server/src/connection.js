const elasticsearch = require('elasticsearch')

// Core ES variable for this project
let index;
let type;
const port = 9200;
const host = process.env.ES_HOST || 'localhost';
const client = new elasticsearch.Client({ host: { host, port  } });

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
async function resetIndex (index, type) {
  index = index;
  type = type;
  if (await client.indices.exists({ index })) {
    await client.indices.delete({ index })
  }
  await client.indices.create({ index })
  await putDataMapping(index, type)
}

async function putDataMapping (index, type) {
  const schema = {
    // title: { type: 'keyword' },
    // author: { type: 'keyword' },
    // location: { type: 'integer' },
    text: { type: 'text' }
  }
  return client.indices.putMapping({ index, type, body: { properties: schema }})
}

module.exports = {
  client, index, type, checkConnection, resetIndex
}