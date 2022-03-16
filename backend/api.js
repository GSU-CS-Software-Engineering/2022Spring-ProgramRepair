var express = require('express');
var router = express.Router();

var problemController = require('./problemController.js');

router.get('/*', problemController.problem_list);

module.exports = router;