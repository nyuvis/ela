const express = require('express');
const cors = require('cors');
const onHeaders = require('on-headers');
const bodyParser = require('body-parser');
const compression = require('compression')
const path = require('path');

const app = new express();

app.use(compression())

// Listening to setting response headers
const myMiddleware = (req, res, next) => {
  const start = Date.now();
  onHeaders(res, () => {
    const end = Date.now();
    res.set('X-Response-Time', `${(end - start).toString()} ms`);
  });
  next();
};

// Log each request to the console
app.use(myMiddleware);

// Log percolated errors to the console
app.on('error', err => {
  console.error('Server Error', err)
})

// Set permissive CORS header
app.use(cors());

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use Routes here
app.use('/', require('./routes'));

// Error handling
app.use((err, req, res, next) => {
  console.log(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send({
    status: err.statusCode,
    message: err.message
  });
})
app.use('/ela', express.static(path.join(__dirname,  '../../', 'topic-builder', 'build')));
app.get('/ela/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../../', './topic-builder', 'build', 'index.html'));
});

app.use('/', express.static(path.join(__dirname,  '../../', 'client', 'build')));
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '../../', 'client', 'build', 'index.html'));
});

const port = process.env.PORT || 3001

app
  .listen(port, err => {
    if (err) console.error(err)
    console.log(`App Listening on Port ${port}`)
  })