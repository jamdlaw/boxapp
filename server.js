const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const db = require('./model/db.js');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/boxapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('connection successful'))
.catch(err => console.log('connection error', err));

app.get('/', (req, res) => {
    res.render(path.join(__dirname, 'public/question.ejs'));
})
.post('/', async (req, res) => {
    const answertxt = req.body.txtAnswer;

    try {
        let result = await db.findOne({ answer: answertxt });
        if (result) {
            result.people += 1;
            await result.save();
        } else {
            await db.create({ answer: answertxt, people: 1 });
        }
        renderAnswer();
    } catch (err) {
        console.log(err);
    }

    async function renderAnswer() {
        try {
            let results = await db.find({}).sort({ people: -1 });
            let docArray = results.map(doc => ({ answer: doc.answer, people: doc.people }));

            let templateObj = {
                title: "What others said",
                answers: docArray
            };

            res.render(path.join(__dirname, 'public/answers.ejs'), templateObj);
        } catch (err) {
            console.log(err);
        }
    }
});

app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});

module.exports = app;
