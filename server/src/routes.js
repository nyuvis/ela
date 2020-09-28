const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const loadData = require('./load_data');
const { client } = require('./connection');
const streamifier = require('streamifier');
const { createApolloFetch } = require('apollo-fetch');

// Setting Memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (
      !file.originalname.includes(".csv") &&
      !file.originalname.includes(".tsv") &&
      !file.originalname.includes(".psv") 
    ) {
      return cb(null, false, new Error("Only CSV, TSV and PSV are allowed"));
    }
    cb(null, true);
  }
 });

//  Setting response header for server-sent events
const SSE_RESPONSE_HEADER = {
  'Connection': 'keep-alive',
  'Content-Type': 'text/event-stream',
  "Cache-Control": "no-cache",
  'X-Accel-Buffering': 'no',
};

// get userId from Query string
function getUserId(req) {
  return req.params.userId;
}

// User streams
global.usersStreams = {}

// serversent events user registration endpoint
router.get('/sse/:userId', (req, res) => {
  let userId = getUserId(req);
  // stores this connection
  global.usersStreams[userId] = {
    res,
    lastInteraction: null
  };
  // write response header
  res.writeHead(200, SSE_RESPONSE_HEADER);
  // Note: Heatbeat for avoidance of client's request timeout of first time (30 sec)
  const heartbeat = {type: 'heartbeat'}
  res.write(`data: ${JSON.stringify(heartbeat)}\n\n`);
  res.flush();

  global.usersStreams[userId].lastInteraction = Date.now()

  // Interval loop to check for data to send
  let intervalId = setInterval(()=> {
    console.log(`*** Interval loop. userId: "${userId}"`);
    if (!global.usersStreams[userId]) return;
    res.write(`data: ${JSON.stringify(heartbeat)}\n\n`);
    res.flush();
    global.usersStreams[userId].lastInteraction = Date.now()
  }, 3000);

  //  need to check if we need to avoid timeout

   req.on("close", function() {
    let userId = getUserId(req);
    console.log(`*** Close. userId: "${userId}"`);
    // Breaks the interval loop on client disconnected
    clearInterval(intervalId);
    // Remove from connections
    delete global.usersStreams[userId];
  });

  req.on("end", function() {
    let userId = getUserId(req);
    console.log(`*** End. userId: "${userId}"`);
    clearInterval(intervalId);
    delete global.usersStreams[userId];
  });
})

// Send stream
const sendStream = async (userId, data) => {
  if (!userId) return;
  if (!global.usersStreams[userId]) return;
  if (!data) return;

  const { res } = global.usersStreams[userId];
  res.write(`data: ${JSON.stringify({ type: 'service_status', data })}\n\n`);
  res.flush();
  global.usersStreams[userId].lastInteraction = Date.now();
};

// @route POST /previewData
// @desc  return a list of 50 rows 
// @access Public
router.post('/previewData', upload.single('file'), (req, res, next) => {
  let csvData = [];
  let headersToRem;
  let headerList;
  let regex;
  let columnNumber;
  let fileType;

  try {
    let fileSeparator;
    if (req.file.originalname.includes(".csv")) {
      fileSeparator = ',';
      fileType = 'csv';
    } else if (req.file.originalname.includes(".tsv")) {
      fileSeparator = '\t';
      regex = fileSeparator;
      fileType = 'tsv';
    } else if (req.file.originalname.includes(".psv")) {
      fileSeparator = '|';
      regex = fileSeparator;
      fileType = 'psv';
    }
    const file = req.file.buffer;
    const column = req.body.column;
    // Read selected column record from filePath, and index each record in elasticsearch
    streamifier.createReadStream(file)
    .on('error', () => {
      console.log("file not present")
    })
    .pipe(csv({ separator: '\n'}))
    .on('headers', (headers) => {
      headersToRem = headers;
      headerList = headersToRem[0].split(fileSeparator);
      for(i=0;i<headerList.length;i++) {
        if(headerList[i] === column) {
          columnNumber = i;
        }
      }
    })
    .on('data', (row) => {
      if((csvData.length <= 49) && row[headersToRem]){
        if( fileType == 'csv') {
          let regex1 = '(*|*)'
          let rowContent = row[headersToRem];
          let rowContentWithoutCommaSeparator = rowContent.replace(/[\S],+[\S\r\n]/g, (v) => {
            return v.replace(/,/g, regex1);
          });
          contentList = rowContentWithoutCommaSeparator.split(regex1);
          const record = {};
          record[headerList[columnNumber]]= contentList[columnNumber];
          csvData.push(record);
        } else {
          const contentList = row[headersToRem].split(regex);
          const record = {};
          record[headerList[columnNumber]]= contentList[columnNumber];
          csvData.push(record);
        }
      }
    })
    .on('end', () =>{
      res.json({
        status: "success",
        data: csvData
      });
    })
  } catch (error) {
    let err = new Error(`Invalid File`);
    err.statusCode = 400;
    next(err);
  }
})

// @route POST /getColumnTypes
// @desc  return a list of column in file
// @access Public
router.post('/getColumnTypes', upload.single('file'), (req, res, next) => {
    try {
      let fileSeparator;
      if (req.file.originalname.includes(".csv")) {
        fileSeparator = ',';
      } else if (req.file.originalname.includes(".tsv")) {
        fileSeparator = '\t';
      } else if (req.file.originalname.includes(".psv")) {
        fileSeparator = '|';
      }
      const file = req.file.buffer;
      streamifier.createReadStream(file)
      .pipe(csv({ separator: '\n'}))
      .on('headers', (headers) => {
        res.json({
          status: "success",
          headerList: headers[0].split(fileSeparator)
        });
      })
    } catch (error) {
      let err = new Error(`Invalid File`);
      err.statusCode = 400;
      next(err);
    }
})

// @route POST /buildIndex
// @desc  build index into elastic search
// @access Public
router.post('/buildIndex/:userId',upload.single('file'), (req, res, next) => {
  const column = req.body.column;
  const index = req.body.indexName;
  const file = req.file;
  let userId = getUserId(req);
  const stopwordlist = (req.body.stopwordlist.length>1) ? req.body.stopwordlist.trim().split(/\s*,\s*/): [];
  try {
    // pushing data into elastic Search and feeding the same data to train model
    loadData.readAndInsertData(index, file, column, res, userId, sendStream, stopwordlist);
  } catch (error) {
    let err = new Error(`Error in building Index`);
    err.statusCode = 500;
    next(err);
  }
})

// @route GET /getIndexes
// @desc  get the available index in ElasticSearch
// @access Public
router.get('/getIndexes', async (req, res, next) => {
  try {
    const data = await client.cat.indices();
    if( data.length) {
      const indexes = data.trim().split('\n');
      const indexNameList = [];
      for (i=0; i<indexes.length; i++) {
        indexNameList.push(indexes[i].split(/(\s+)/).filter((e) => e.trim().length > 0 )[2]);
      }
      const regex = /^(?!^\.)/;
      const list = indexNameList.filter((index) => index.match(regex));
      res.json({
        status: "success",
        data: list
      });
    }
  } catch (error) {
    let err = new Error(`Error in getting Indexes`);
    err.statusCode = 500;
    next(err);
  }
});


// @route POST /search
// @desc  search the Elastic Search
// @access Public
router.post('/search', async (req, res) => {
  const { index, searchTerm, searchOffset } = req.body;
    const data = await client.search({ 
      index,
      type: 'doc',
      body: {
        from: searchOffset,
        query: { 
          match : {
            text: {
              query: searchTerm,
              operator: 'and',
              fuzziness: 'auto'
            }
      }},
      highlight: { fields: { text: {}}}

      }});
      res.json({
        status: "success",
        data
      })
});

/**
 * POST /getID
 * Get the ID of Collection in texas
 */
router.post('/getID', async (req, res) => {
  try {
    const { index } = req.body;
    if(index) {
      const fetch = createApolloFetch({
        uri: `http://texas-api:4200/graphql`,
      }); 
      const data = await fetch({
        query: `{
          Datasets {
            ID,
            Name
          }
        }`
      })
      if(data.data) {
        res.json({
          status: "success",
          data
        });
      }
      if(data.errors) {
        console.log("Errors in Adding Collection: ",data.errors[0].message);
      }
    }
  } catch(ex) {
    console.log(ex);
  }
});

module.exports = router;

