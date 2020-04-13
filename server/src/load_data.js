const esConnection = require('./connection');
const csv = require('csv-parser');
const streamifier = require('streamifier');
const { spawn } = require('child_process')
const path = require('path')
var fs = require('fs')
const DOC_FOLDER_NAME = process.env.DOC_FOLDER_NAME || 'model_csv_files';


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
 
 async function callPythonScripts(listOfDocs, indexName, documentIdList, userId, sendStream) {

  let dir = path.join(__dirname, ".././"+DOC_FOLDER_NAME);
  
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
      let collectionPath = path.join(__dirname, ".././"+DOC_FOLDER_NAME+"/"+indexName);
      if (!fs.existsSync(collectionPath)){
        fs.mkdirSync(collectionPath);
      }
  } else {
    let collectionPath = path.join(__dirname, ".././"+DOC_FOLDER_NAME+"/"+indexName);
    if (!fs.existsSync(collectionPath)){
      fs.mkdirSync(collectionPath);
    }
  }
  sendStream(userId, "Building Topics");
  const ldaScript = await spawnPythonScripts([path.join(__dirname, "pythonScripts/lda_Script.py"), 'document_list', indexName, DOC_FOLDER_NAME], listOfDocs);
  if (ldaScript === "SUCCESS") {
    sendStream(userId, "Topics Build Successfully");
  } else {
    sendStream(userId, "Topics Build Failed");
  }
  sendStream(userId, "Building Model");
  const Doc2Vec = await spawnPythonScripts([path.join(__dirname, "pythonScripts/doc2vec_Script.py"), 'document_list', indexName, DOC_FOLDER_NAME], listOfDocs);
  if (Doc2Vec === "SUCCESS") {
    sendStream(userId, "Model Build Successfully, Building Projections");
    const umapScript = await spawnUmapScripts([path.join(__dirname, "pythonScripts/umap_Script.py"), 'Doc2vec_Model', 'document_list', indexName, DOC_FOLDER_NAME], listOfDocs, documentIdList)
    if (umapScript === "SUCCESS") {
      sendStream(userId, "Projections Build Successfully");
    } else {
      sendStream(userId, "Projections Build Failed");
    }
  } else {
    sendStream(userId, "Model Build Failed");
  }
}


// Clear the ES index, parse and index all files from the book directory
async function readAndInsertData (index, file, column, res, userId, sendStream) {
  let csvData = [];
  let pythonScriptInput = [];
  let documentIdList = [];
  let headersToRem;
  let headerList;
  let batchCounter = 0;
  let documentId = 1;

  try {
    // fix separator
      let fileSeparator;
      if (file.originalname.includes(".csv")) {
        fileSeparator = ',';
      } else if (file.originalname.includes(".tsv")) {
        fileSeparator = '\t';
      } else if (file.originalname.includes(".psv")) {
        fileSeparator = '|';
      }
    //Clear previous index
    await esConnection.resetIndex(index, 'doc');

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
        const contentList = row[headersToRem].split(fileSeparator);
        const record = {};
        for(i=0;i<headerList.length;i++) {
          if(headerList[i] === column) {
            record[headerList[i]]= contentList[i];
            // creating list of list of rows content
            pythonScriptInput.push(contentList[i].toLowerCase());
            documentIdList.push(documentId);
            documentId += 1;
          }
        }
        csvData.push(record);
      }
      if(csvData.length >= 500) {
        // insert 500 rows to elastic Search
        insertDataIntoES(csvData, index, 'doc',column, batchCounter);
        batchCounter += 1;
        csvData = [];
      }
    })
    .on('end', () =>{
      // Insert the last rows which are less than 500
      insertDataIntoES(csvData, index, 'doc',column, batchCounter);
      // Calling python script with data
      callPythonScripts(pythonScriptInput, index, documentIdList, userId, sendStream);
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
  let bulkOps = []; // Array to store bulk operations
  
  // Add an index operations for each sections in the book
  for (let i=0; i< csvData.length; i++) {
    // Describe actions
    bulkOps.push({ index: { _index: index, _type: type }})
    // Add document
    bulkOps.push({
      location: (batchCounter*500) + i,
      text: csvData[i][column]
    })
  }

  // Insert remainder of the bulk Ops array
  await esConnection.client.bulk({  body: bulkOps });
  console.log(`Indexed Records ${(batchCounter*500)+1} - ${(batchCounter*500) + csvData.length}\n\n\n`);
}

module.exports = {
  readAndInsertData
}