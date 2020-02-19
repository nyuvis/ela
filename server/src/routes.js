const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const loadData = require('./load_data');
const search = require('./search')

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
    let responseBody;
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
  console.log(req.body);
  const filename = req.body.fileName;
  const column = req.body.column;
  const columnIndex = req.body.columnIndex;
  const index = req.body.indexName;
  const type = req.body.type;
  const filepath = path.join(__dirname, 'uploads/') + filename ;

  loadData.readAndInsertData(index, type, filepath, column);
  res.json({
    status: "success",
  });
})

  /**
 * GET /search
 * Search for a term in the Elastic search
 */
router.get('/search', async (req, res) => {
  const { term, offset } = req.query
  res.body = await search.queryTerm(term, offset)
});

module.exports = router;
