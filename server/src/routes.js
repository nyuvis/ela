const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const loadData = require('./load_data');
const { client } = require('./connection');
const streamifier = require('streamifier');

// Setting Memory storage
const upload = multer({ storage: multer.memoryStorage() });

router.post('/getColumnTypes', upload.single('file'), (req, res) => {
    try {
      const file = req.file.buffer;
      streamifier.createReadStream(file)
      .pipe(csv({ separator: '\n'}))
      .on('headers', (headers) => {
        res.json({
          status: "success",
          headerList: headers[0].split('\t')
        });
      })
    } catch (error) {
      console.log(error);
    }
})

// @route POST /buildIndex
// @desc  build index into elastic search
// @access Public
router.post('/buildIndex',upload.single('file'), (req, res) => {
  const column = req.body.column;
  const index = req.body.indexName;
  const file = req.file.buffer;

  loadData.readAndInsertData(index, file, column, res);
})

// @route GET /getIndexes
// @desc  get the available index in ElasticSearch
// @access Public
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
 * GET /testElasticSearch
 * Search for a term in the Elastic search
 */
router.get('/deleteIndex', async (req, res) => {
  // console.log(client);

  // const data = await client.delete({ index});
});


module.exports = router;
