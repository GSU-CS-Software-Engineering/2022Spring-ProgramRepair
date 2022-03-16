var express = require('express');
var path = require('path');

var indexRouter = require('./indexRouter.js');
var problemRouter = require('./api.js');

var app = express();

app.use(express.json());

app.use('/', indexRouter);
app.use('/api/*', problemRouter);

app.listen(8080, () => console.info('Server has started on port 8080.'));

module.exports = app;