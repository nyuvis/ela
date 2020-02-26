const express = require('express');
const cors = require('cors');
const onHeaders = require('on-headers');
const bodyParser = require('body-parser');

const app = new express();

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


const port = process.env.PORT || 3001

app
  .listen(port, err => {
    if (err) console.error(err)
    console.log(`App Listening on Port ${port}`)
  })