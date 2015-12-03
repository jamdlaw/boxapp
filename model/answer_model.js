var mongoose = require('mongoose');

var AnswerSchema = new mongoose.Schema({
  answer: String,
  people: Number
});

module.exports = mongoose.model('Answer', AnswerSchema);