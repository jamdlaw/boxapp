var express = require('express'); 
var path = require('path')
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var db = require('./model/db.js') 
var app = express();

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/boxapp', function(err) {
    if(err) {
        console.log('connection error', err);
    } else {
        console.log('connection successful');
    }
});

app.get('/',function(req,res){
	res.sendFile(path.join(__dirname + '/public/question.html'));
})
.post('/', function(req,res){
	// get the text from the input
	var answertxt = req.body.txtAnswer;
    //query to see if answer exists
    db.find({answer:answertxt}, {answer: 1 ,people:1}, function(err,result){
        //now let check for errors
        if(err){
            return console.log(err);
        } 
        // if answer is found then increment the answer value
        if(typeof result[0] != 'undefined'){
            db.findById(result[0]._id , function(err,answer){
                answer.people += 1;  
                answer.save(function (err, answer,numAffected){
                       if(err){console.log('error updating the answer')};
                       renderAnswer(); 
                });
            });            
        }
        else{
           //create the answer 
          db.create({answer:answertxt, people:1}, function(err, answer){
                if(err){console.log('error saving new answer');}
                renderAnswer();
          });  
        }
    });
    function renderAnswer () {
    	//set our DB veriable
        var templateObj = {};
        db.find({}, function(err, result){ 
        var docArray = [];
        if (err || !result ) {console.log("an error has occurred or empty result"); return;}
        for(var key in result){
                //console.log(result[myAnswer].answer);
                docArray[key] = {'answer': result[key].answer, 'people':result[key].people};
            }
         templateObj = {
            title : "What others said", 
            answers: docArray
        };
        res.render(__dirname + '/public/answers.ejs', templateObj );
        });
    }
});


app.listen(3000);
console.log('Server is running at http://localhost:3000');

// this is needed to be able to test the express app???
module.exports = app;