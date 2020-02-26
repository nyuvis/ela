const fs = require('fs');
const path = require('path');
const esConnection = require('./connection');
const csvToJson = require('csvtojson');
const csv = require('csv-parser');


// Clear the ES index, parse and index all files from the book directory
async function readAndInsertData (index, filePath, column, res) {
  const csvData = [];
  let headersToRem;
  let headerList;

  try {
    //Clear previous index
    await esConnection.resetIndex(index, 'doc');

    // Read selected column record from filePath, and index each record in elasticsearch
    fs.createReadStream(path.join(filePath))
    .on('error', () => {
      console.log("file not present")
    })
    .pipe(csv({ separator: '\n'}))
    .on('headers', (headers) => {
      headersToRem = headers;
      headerList = headersToRem[0].split('\t');
    })
    .on('data', (row) => {
      if(row[headersToRem]){
        const contentList = row[headersToRem].split('\t');
        const record = {};
        for(i=0;i<headerList.length;i++) {
          if(headerList[i] === column) {
            record[headerList[i]]= contentList[i];
          }
        }
        csvData.push(record);
      }
    })
    .on('end', () =>{
      insertDataIntoES(csvData, index, 'doc',column, res);
    })
    
  } catch(err) {
  console.error(err);
  }
}

async function insertDataIntoES(csvData, index, type, column, res) {
  let bulkOps = []; // Array to store bulk operations

  // Add an index operations for each sections in the book
  for (let i=0; i< csvData.length; i++) {
    // Describe actions
    bulkOps.push({ index: { _index: index, _type: type }})

    // Add document
    bulkOps.push({
      location: i,
      text: csvData[i][column]
    })
    
    if(i>0 && i % 500 === 0) { // Do bulk inserts in 500 paragraph batches
      await esConnection.client.bulk({  body: bulkOps });
      bulkOps = [];
      console.log(`Indexed Records ${i-499}- ${i}`);
    }
  }

  // Insert remainder of the bulk Ops array
  await esConnection.client.bulk({  body: bulkOps });
  console.log(`Indexed Records ${csvData.length - (bulkOps.length/2)} - ${csvData.length}\n\n\n`);
  res.json({
    status: "success",
  });
}

module.exports = {
  readAndInsertData
}