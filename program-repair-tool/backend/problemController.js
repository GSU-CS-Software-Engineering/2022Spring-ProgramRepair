var Problems = require('./problems');
problems = new Problems();

const path = require("path");

//This function will obtain the problemList from the problems object and send it to the client.

exports.problem_list = function(req, res) {
    problemList = problems.getProblems();
    res.send(problemList);
}