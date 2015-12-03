
var express = require('express');
var app = express();

console.log('Welcome to My Console,');
setTimeout(function() {
    console.log('Blah blah blah blah extra-blah');
}, 3000);



app.listen(3000);
console.log('Server is running at http://localhost:3000');
