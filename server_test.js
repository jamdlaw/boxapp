var express = require('express'); 
var mongoose = require('mongoose');
var Answer = require('./model/answer_model.js');

var app = express();

mongoose.connect('mongodb://localhost/boxapp', function(err) {
    if(err) {
        console.log('connection error', err);
    } else {
        console.log('connection successful');
    }
});

/* GET /todos listing. */
app.get('/', function(req, res, next) {
  Answer.find(function (err, answer) {
    if (err) return next(err);
    res.json(answer);
  });
});

/* POST /answer */
app.get('/create', function(req, res, next) {
  Answer.create({answer:"cat", people:1});
  res.send("all good");
  });


app.listen(3000);
console.log('Server is running at http://localhost:3000');

// this is needed to be able to test the express app???
module.exports = app;