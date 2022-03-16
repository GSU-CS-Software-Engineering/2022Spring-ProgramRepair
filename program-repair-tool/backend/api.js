var express = require('express');
var router = express.Router();

var problemController = require('problemController');

router.get('/problemlist', problemController.problem_list);