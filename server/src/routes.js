const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const loadData = require('./load_data');
const { client } = require('./connection');

// Setup Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads/'));
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname );
  }
});

// Upload Instance for single file
const upload = multer({ storage }).single('file');


const columnTypes = () => {
// function to find the data types of column in csv file
}

// @route POST /getColumnTypes
// @desc  upload a file to get column types
// @access Public
router.post('/getColumnTypes', (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
        return res.status(500).json(err)
    } else if (err) {
        return res.status(500).json(err)
    }
    const filepath = path.join(__dirname, 'uploads/') + req.file.originalname ;
    fs.createReadStream(path.join(filepath))
    .pipe(csv({ separator: '\n'}))
    .on('headers', (headers) => {
      console.log(`First header:---- ${headers[0]}`)
      res.json({
        status: "success",
        headerList: headers[0].split('\t')
      });
    })
  })
})



// @route POST /getColumnTypes
// @desc  upload a file to get column types
// @access Public
router.post('/buildIndex', (req, res) => {
  const filename = req.body.fileName;
  const column = req.body.column;
  const index = req.body.indexName;
  const filepath = path.join(__dirname, 'uploads/') + filename ;

  loadData.readAndInsertData(index, filepath, column, res);
})

  /**
 * GET /search
 * Search for a term in the Elastic search
 */
router.get('/getIndexes', async (req, res) => {
  try {
    const data = await client.cat.indices();
    if( data.length) {
      const indexes = data.trim().split('\n');
      const indexNameList = [];
      for (i=0; i<indexes.length; i++) {
        indexNameList.push(indexes[i].split(/(\s+)/).filter((e) => e.trim().length > 0 )[2]);
      }
      res.json({
        status: "success",
        data: indexNameList
      });
    }
  } catch (error) {
    console.log(error);
  }
});



 /**
 * GET /testElasticSearch
 * Search for a term in the Elastic search
 */
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
  // const data = await client.cat.indices({v: true});
});





/**
 * GET /testElasticSearch
 * Search for a term in the Elastic search
 */
router.get('/deleteIndex', async (req, res) => {
  // console.log(client);

  // const data = await client.delete({ index});
});


module.exports = router;
