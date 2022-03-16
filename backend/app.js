var express = require('express');
var path = require('path');
const cors = require('cors');
const corsOptions = {
    origin: '*',
    credentials: true,
    openSuccessStatus: 200,
}

var problemRouter = require('./api.js');

var app = express();

app.use(express.json());

app.use(cors(corsOptions));

app.use('/*', problemRouter);

app.listen(3080, () => console.info('Server has started on port 3080.'));

module.exports = app;