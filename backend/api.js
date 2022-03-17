/*
This file makes it so that the Express router will call problemController.js's problem_list method when it recieves any get request.
*/
var express = require('express');
var router = express.Router();

var problemController = require('./problemController.js');

router.get('/*', problemController.problem_list);

module.exports = router;