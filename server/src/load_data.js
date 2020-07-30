const esConnection = require('./connection');
const csv = require('csv-parser');
const streamifier = require('streamifier');
const { spawn } = require('child_process')
const path = require('path')
var fs = require('fs')
const DOC_FOLDER_NAME = process.env.DOC_FOLDER_NAME || 'model_csv_files';
const TOPICS_FOLDER_NAME = process.env.TOPICS_FOLDER || 'projections';
const { createApolloFetch } = require('apollo-fetch');


async function spawnPythonScripts(params, listOfDocs) {

  return new Promise(function(resolve, reject){
    
    let stdout  = [];
    let stderr = [];
    
    // spawn new child process to call the python script
    const python = spawn('python', params);
    python.stdin.write(JSON.stringify(listOfDocs));
    python.stdin.end();
    
    // collect data from script
    python.stdout.on('data', function (data) {
      console.log('Pipe data from python script ...');
      stdout.push(data);
    });
    python.stderr.on('data', function (data) {
      console.log('Pipe Error data from python script ...');
      stderr.push(data);
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    if (code === 0) {
      console.log(stdout.join(""));
      resolve("SUCCESS");
    } else {
      console.log(stdout.join(""));
      console.log(stderr.join(""));
      reject("ERROR");
    }
    });
  })
}

async function spawnUmapScripts(params, listOfDocs, documentIdList) {

  return new Promise(function(resolve, reject){
    
    let stdout  = [];
    let stderr = [];

    // spawn new child process to call the python script
    const python = spawn('python', params);
  
    python.stdin.write(JSON.stringify(JSON.stringify(listOfDocs)+'\n'+ JSON.stringify(documentIdList)));
    // python.stdin.write(JSON.stringify(documentIdList));
    python.stdin.end();
    
    // collect data from script
    python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...');
    stdout.push(data);
    });
    python.stderr.on('data', function (data) {
      console.log('Pipe Error data from python script ...');
      stderr.push(data);
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    if (code === 0) {
      console.log(stdout.join(""));
      resolve("SUCCESS");
    } else {
      console.log(stdout.join(""));
      console.log(stderr.join(""));
      reject("ERROR");
    }
    });
  })
  }

  async function spawnWord2vecPythonScripts(params) {

    return new Promise(function(resolve, reject){
      
      let stdout  = [];
      let stderr = [];
    
      // spawn new child process to call the python script
      const python = spawn('python', params);
      
      // collect data from script
      python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        stdout.push(data);
      });
      python.stderr.on('data', function (data) {
        console.log('Pipe Error data from python script ...');
        stderr.push(data);
      });
      // in close event we are sure that stream from child process is closed
      python.on('close', (code) => {
      console.log(`child process close all stdio with code ${code}`);
      if (code === 0) {
        console.log(stdout.join(""));
        resolve("SUCCESS");
      } else {
        console.log(stdout.join(""));
        console.log(stderr.join(""));
        reject("ERROR");
      }
      });
    })
  }

 async function addCollectionToTexasServer(indexName) {

  // check if the store is created or not
  let storeCreated = false;
  let indexIDInTexas;
  console.log("Checking Store")
  try {
    const data = await esConnection.client.cat.indices();
    if( data.length) {
      const indexes = data.trim().split('\n');
      const indexNameList = [];
      for (i=0; i<indexes.length; i++) {
        indexNameList.push(indexes[i].split(/(\s+)/).filter((e) => e.trim().length > 0 )[2]);
      }
      const regex = /^(?!^\.)/;
      const list = indexNameList.filter((index) => index.match(regex));
      if(list.indexOf('texas.store.exploratory-labeling.label-sets') != -1){
        storeCreated = true;
        console.log("store already present")
      }
    }
  } catch (error) {
    let err = new Error(`Error in Checking Indexes`);
    console.log(err);
  }

  if(!storeCreated) {
    console.log("Creating store in ES")
    try {
      const fetch1 = createApolloFetch({
        uri: `http://texas-api:4200/graphql`,
      }); 
      fetch1({
        query: `mutation {
          Store {
            createStore(store: {
              ID: "exploratory-labeling",
              Name: "Exploratory Labeling"
            }) {
              ID
              Name
            }
          }
        }`
      }).then(res => {
        if(res.data) {
          console.log("Store Added to ES");
          const fetch2 = createApolloFetch({
            uri: `http://texas-api:4200/graphql`,
          }); 
          fetch2({
            query: `mutation {
              Store(ID: "exploratory-labeling") {
                addCollection(collection: {
                  ID: "label-sets",
                  Name: "LabelSets",
                  Schema: {
                    Fields: [{
                      ID: "labelSetID",
                      Description: "labelSetID",
                      Name: "labelSetID",
                      Type: CATEGORICAL
                    }]
                  }
                }) {
                  ID
                  Name
                }
              }
            }`
          }).then(res => {
            if(res.data) {
              // check with Cristian if we can add properties while creating the LabsetID
              console.log("LabelSet Added to ES");
              console.log("Adding Properties to LabelSetID")
              try {
                 esConnection.client.indices.putMapping({ index: "texas.store.exploratory-labeling.label-sets", type: "document", body: { properties: {
                      "labelSetID": {
                        "type": "keyword"
                      }
                } }}).then(res => {
                  console.log("response is ",res);
                  console.log("Mapping properties Added")
                })
              } catch (error) {
                let err = new Error(`Error in Adding Properties`);
                console.log(err);
              }
            }
            if(res.errors) {
              console.log("Errors in Adding LabelSetID: ", res.errors[0].message);
            }
          })
        }
        if(res.errors) {
          console.log("Errors in Adding Store: ",res.errors[0].message);
        }
      })
      
    } catch(ex) {
      console.log(ex);
    }
  }

  return new Promise(function(resolve, reject){

	try {
    const fetch = createApolloFetch({
      uri: `http://texas-api:4200/graphql`,
    }); 
    fetch({
      query: `mutation createDataset($config:JSON!, $name: String!){System
        {createDataset(dataset: {Name: $name, Provider: "ElasticSearch",Config:$config}){ID}}
        }`,
      variables: { 
        name: indexName,
        config: {
          "index": indexName,
          "type": "doc",
          "client": {
            "hosts": [
              {
                "host": "elasticsearch",
                "port": 9200,
                "path": ""
              }
            ]
          }
        }
       },
    }).then(res => {
      if(res.data.System.createDataset) {
        indexIDInTexas = res.data.System.createDataset.ID;
        resolve(indexIDInTexas);
        console.log("Collection Added to Texas");
      }
      if(res.errors) {
        reject("ERROR");
        console.log("Errors in Adding Collection: ",res.errors[0].message);
      }
    })
  } catch(ex) {
    console.log(ex);
  }
  })
 }

 async function callWord2vecScripts() {

  let dir = path.join(__dirname, ".././"+DOC_FOLDER_NAME);

  // Checking for existence of word2vec Model
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
    let modelPath_ = path.join(__dirname, ".././"+DOC_FOLDER_NAME+"/__texas_models__");
    let tempfilePath = path.join(__dirname, ".././"+DOC_FOLDER_NAME+"/tempfile");
    if (!fs.existsSync(modelPath_)){
      fs.mkdirSync(modelPath_);
      fs.mkdirSync(tempfilePath);
      // Call here to create word2vecmodel
      spawnWord2vecPythonScripts([path.join(__dirname, "pythonScripts/word2vec_Script.py"), "__texas_models__", DOC_FOLDER_NAME ]);
      console.log("Building and loading word2vec model ");
    } else {
      console.log("word2vec model is already loaded");
    }
  } else {
    let modelPath_ = path.join(__dirname, ".././"+DOC_FOLDER_NAME+"/__texas_models__");
    let tempfilePath = path.join(__dirname, ".././"+DOC_FOLDER_NAME+"/tempfile");
    if (!fs.existsSync(modelPath_)){
      fs.mkdirSync(modelPath_);
      fs.mkdirSync(tempfilePath);
      spawnWord2vecPythonScripts([path.join(__dirname, "pythonScripts/word2vec_Script.py"), "__texas_models__", DOC_FOLDER_NAME ]);
      console.log("Building and loading word2vec model ");
    } else {
      console.log("word2vec model is already loaded");
    }
  }
 }
 
 async function callPythonScripts(listOfDocs, indexName, documentIdList, userId, sendStream, stopwordlist) {

  let res = await addCollectionToTexasServer(indexName);
  let ID;
  if (res != 'ERROR'){
    ID = res;
  }
  let dir = path.join(__dirname, ".././"+DOC_FOLDER_NAME);
  let topics_dir = path.join(__dirname, ".././"+TOPICS_FOLDER_NAME);

  if (!fs.existsSync(topics_dir)){
    fs.mkdirSync(topics_dir);
    let collectionPath_topics = path.join(__dirname, ".././"+TOPICS_FOLDER_NAME+"/"+ID);
    if (!fs.existsSync(collectionPath_topics)){
      fs.mkdirSync(collectionPath_topics);
    }
  } else {
    let collectionPath_topics = path.join(__dirname, ".././"+TOPICS_FOLDER_NAME+"/"+ID);
    if (!fs.existsSync(collectionPath_topics)){
      fs.mkdirSync(collectionPath_topics);
    }
  }
  
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
      let collectionPath = path.join(__dirname, ".././"+DOC_FOLDER_NAME+"/"+indexName);
      if (!fs.existsSync(collectionPath)){
        fs.mkdirSync(collectionPath);
      }
      let collectionModelPath = path.join(__dirname, ".././"+DOC_FOLDER_NAME+"/"+indexName+"/models");
      if (!fs.existsSync(collectionModelPath)){
        fs.mkdirSync(collectionModelPath);
      }
      let collectionProjectionPath = path.join(__dirname, ".././"+DOC_FOLDER_NAME+"/"+indexName+"/projections");
      if (!fs.existsSync(collectionProjectionPath)){
        fs.mkdirSync(collectionProjectionPath);
      }
  } else {
    let collectionPath = path.join(__dirname, ".././"+DOC_FOLDER_NAME+"/"+indexName);
    if (!fs.existsSync(collectionPath)){
      fs.mkdirSync(collectionPath);
    }
    let collectionModelPath = path.join(__dirname, ".././"+DOC_FOLDER_NAME+"/"+indexName+"/models");
      if (!fs.existsSync(collectionModelPath)){
        fs.mkdirSync(collectionModelPath);
      }
    let collectionProjectionPath = path.join(__dirname, ".././"+DOC_FOLDER_NAME+"/"+indexName+"/projections");
    if (!fs.existsSync(collectionProjectionPath)){
      fs.mkdirSync(collectionProjectionPath);
    }
}
  sendStream(userId, "Building Topics");
  const ldaScript = await spawnPythonScripts([path.join(__dirname, "pythonScripts/lda_Script.py"), 'document_list', ID, TOPICS_FOLDER_NAME, stopwordlist], listOfDocs);
  if (ldaScript === "SUCCESS") {
    sendStream(userId, "Topics Build Successfully");
  } else {
    sendStream(userId, "Topics Build Failed");
  }
  sendStream(userId, "Building Model");
  const Doc2Vec = await spawnPythonScripts([path.join(__dirname, "pythonScripts/doc2vec_Script.py"), 'document_list', indexName, DOC_FOLDER_NAME, stopwordlist], listOfDocs);
  if (Doc2Vec === "SUCCESS") {
    sendStream(userId, "Model Build Successfully, Building Projections");
    const umapScript = await spawnUmapScripts([path.join(__dirname, "pythonScripts/umap_Script.py"), 'Doc2vec_Model', 'document_list', indexName, DOC_FOLDER_NAME, stopwordlist], listOfDocs, documentIdList)
    if (umapScript === "SUCCESS") {
      let pathProj = path.join(__dirname, ".././"+DOC_FOLDER_NAME+"/"+indexName+"/projections");
      insertProjectionToES(indexName, pathProj)
      sendStream(userId, "Projections Build Successfully");
    } else {
      sendStream(userId, "Projections Build Failed");
    }
  } else {
    sendStream(userId, "Model Build Failed");
  }
}

async function insertProjectionToES(index, path) {
  let results = [];
  let headersToRem = '';
  fs.createReadStream(path + '/umap_proj.csv')
  .pipe(csv({ separator: '\n'}))
  .on('headers', (headers) => {
    headersToRem = headers;
  })
  .on('data', (data) => {
    results.push(data[headersToRem])
    if(results.length >= 500) {
      // insert 500 rows to elastic Search
      updateDataIntoES(results, index, 'doc');
      results = [];
    }
  })
  .on('end', () => {
    updateDataIntoES(results, index, 'doc');
  });
}

async function updateDataIntoES(csvData, index, type) {
  let bulkOps = []; // Array to store bulk operations
  // Add an index operations for each sections in the book
  for (let i=0; i< csvData.length; i++) {
    // Describe actions
    let csvDataList = csvData[i].split(',');
  
    bulkOps.push({ update: { _index: index, _type: type, _id: csvDataList[0] }})
    // Update document
    bulkOps.push({
      doc: {
      __nlp__: {
        text: {
          projection_point: {
            x: parseFloat(csvDataList[1]),
            y: parseFloat(csvDataList[2])
          }
        }
      }
    }
    })
  }

  // Insert remainder of the bulk Ops array
  try {
    await esConnection.client.bulk({  body: bulkOps });
    console.log(`Indexed Records ${csvData[0]} - ${csvData[csvData.length-1]}\n`);
  } catch(err) {
    console.error(err);
  }
}


// Clear the ES index, parse and index all files from the book directory
async function readAndInsertData (index, file, column, res, userId, sendStream, stopwordlist) {
  let csvData = [];
  let pythonScriptInput = [];
  let documentIdList = [];
  let headersToRem;
  let headerList;
  let batchCounter = 0;
  let documentId = 1;
  let regex;

  try {
    // fix separator
      let fileSeparator;
      if (file.originalname.includes(".csv")) {
        fileSeparator = ',';
        regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
      } else if (file.originalname.includes(".tsv")) {
        fileSeparator = '\t';
        regex = fileSeparator;
      } else if (file.originalname.includes(".psv")) {
        fileSeparator = '|';
        regex = fileSeparator;
      }
    //Clear previous index
    await esConnection.resetIndex(index, 'doc', stopwordlist);

    // Read selected column record from filePath, and index each record in elasticsearch
    streamifier.createReadStream(file.buffer)
    .on('error', () => {
      console.log("file not present")
    })
    .pipe(csv({ separator: '\n'}))
    .on('headers', (headers) => {
      headersToRem = headers;
      headerList = headersToRem[0].split(fileSeparator);
    })
    .on('data', (row) => {
      if(row[headersToRem]){
        let contentList = row[headersToRem].split(regex);
        // handle format Errors in row
        if(contentList.length != headerList.length){
          console.log("Format Errors in Data rows 1st Check");
          // handle errors due to comma inside double quotes
          let rowContent = row[headersToRem];
          let rowContentWithoutComma = rowContent.replace(/(?<=\,").+?(?=\",\S)/g, function(v) { 
            return v.replace(/,/g, '');
          });
          let rowContentWithoutQuotes = rowContentWithoutComma.replace(/\"/g, '');
          contentList = rowContentWithoutQuotes.split(regex);
        }
        // handle format Errors
        if(contentList.length != headerList.length){
          // still the content list is bigger means unhandled by regex defined above or missing newline carriage return on lines
          // means there are multiple record in one line
          console.log("Format Errors in Data rows 2nd Check");
          let rowContent = row[headersToRem];
          if (rowContent.indexOf('\r\n')) {
            let rowsContent = rowContent.split('\r\n');
            for(let i=0; i < rowsContent.length;i++){
              currentRowContent = rowsContent[i].split(regex);
              const record = {};
              record[headerList[columnNumber]]= currentRowContent[columnNumber];
              // creating list of list of rows content
              pythonScriptInput.push(currentRowContent[columnNumber].toLowerCase());
              documentIdList.push(documentId);
              documentId += 1;
              csvData.push(record);
              if(csvData.length >= 500) {
                // insert 500 rows to elastic Search
                insertDataIntoES(csvData, index, 'doc',column, batchCounter);
                batchCounter += 1;
                csvData = [];
              }
            }
          }
        } else {
          const record = {};
          record[headerList[columnNumber]]= contentList[columnNumber];
          // creating list of list of rows content
          pythonScriptInput.push(contentList[columnNumber].toLowerCase());
          documentIdList.push(documentId);
          documentId += 1;
          csvData.push(record);
          if(csvData.length >= 500) {
            // insert 500 rows to elastic Search
            insertDataIntoES(csvData, index, 'doc',column, batchCounter);
            batchCounter += 1;
            csvData = [];
          }
        }
      } else {
        console.log("Missing Headers in the row");
      }
    })
    .on('end', () =>{
      // Insert the last rows which are less than 500
      insertDataIntoES(csvData, index, 'doc',column, batchCounter);
      // Calling python script with data
      callPythonScripts(pythonScriptInput, index, documentIdList, userId, sendStream, stopwordlist);
      res.json({
        status: "success",
        message: "Collection Build Successful..!"
      });
    })
  } catch(err) {
    console.error(err);
  }
}

async function insertDataIntoES(csvData, index, type, column, batchCounter) {
  
  let bulkOps = [];
  // Array to store bulk operations
  // Add an index operations for each sections in the book
  for (let i=0; i< csvData.length; i++) {
    bulkOps.push({ index: { _index: index, _type: type, _id: ((batchCounter*500) + i+1) }})
    // Add document
    bulkOps.push({
      location: (batchCounter*500) + i+1,
      text: csvData[i][column]
    })
  }
  try {
    await esConnection.client.bulk({  body: bulkOps });
    console.log(`Indexed Records ${(batchCounter*500)+1} - ${(batchCounter*500) + csvData.length}\n`);
  } catch(err) {
    console.error(err);
  }
}

module.exports = {
  readAndInsertData,
  callWord2vecScripts
}