const express = require('express');
const app = express();
const topic = require('./lib/topic');
const author = require('./lib/author');
const bodyParser = require('body-parser');
const topicRouter = require('./routes/topic');
const indexRouter = require('./routes/index');
const authorRouter = require('./routes/author');
var helmet = require('helmet');
// app.use(helmet());

app.use(express.static('public'));
app.use(express.static('css'));
app.use(bodyParser.urlencoded({ extended: false}));


app.use('/', indexRouter);
app.use('/topic', topicRouter);

app.get('/authors', (request, response) => author.home(request, response));
app.use('/author', authorRouter);


app.use(function(req, res, next) {
res.status(404).send('Sorry cant find that!');
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));