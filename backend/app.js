/*
Given the settings in package.json, this is the file that is run when "npm run start" is typed into the terminal, starting the server.
Express is used for routing.
The CORS options are set this way in order to allow requests from sources that have a different origin, so the client app.
*/
var express = require('express');
var path = require('path');
const cors = require('cors');
const corsOptions = {
    origin: '*',
    credentials: true,
    openSuccessStatus: 200,
}

/*
An Express app is created that uses JSON, the CORS options that were declared earlier, and api.js to handle any incoming requests, as this server only serves the available problems for now.
The server will listen on port 3080 and output a message to the terminal window telling the user as such.
*/

var problemRouter = require('./api.js');

var app = express();

app.use(express.json());

app.use(cors(corsOptions));

app.use('/*', problemRouter);

app.listen(3080, () => console.info('Server has started on port 3080.'));

module.exports = app;