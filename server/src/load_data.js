const esConnection = require('./connection');
const csv = require('csv-parser');
const streamifier = require('streamifier');


// Clear the ES index, parse and index all files from the book directory
async function readAndInsertData (index, file, column, res) {
  let csvData = [];
  let headersToRem;
  let headerList;
  let batchCounter = 0;

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
          }
        }
        csvData.push(record);
      }
      if(csvData.length >= 500) {
        insertDataIntoES(csvData, index, 'doc',column, batchCounter);
        batchCounter += 1;
        csvData = [];
      }
    })
    .on('end', () =>{
      insertDataIntoES(csvData, index, 'doc',column, batchCounter);
      res.json({
        status: "success",
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