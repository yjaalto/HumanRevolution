const express = require('express');
const app = express();
const topic = require('./lib/topic');
const author = require('./lib/author');
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(express.static('css'));
app.use(bodyParser.urlencoded({ extended: false}));
app.get('/', (req, res) => topic.home(res));

app.get('/page/:pageId', function(request, response){
    topic.page(request, response);
});

app.get('/create', function(request, response) {
    topic.create(request, response);
});

app.post('/create_process', function(request, response){
    topic.create_process(request, response);
});

app.get('/update/:pageId', function(request, response) {
    topic.update(request, response);
});

app.post('/update_process', function(request, response){
    topic.update_process(request, response);
});

app.post('/delete_process', function(request, response){
    topic.delete_process(request, response);
});

app.get('/authors', (request, response) => author.home(request, response));

app.post('/author/create_process', (request, response) => author.create_process(request, response));

app.get('/author/update/:authorId', (request, response) => author.update(request, response));

app.post('/author/update_process', (request, response) => author.update_process(request, response));

app.post('/author/delete_process', (request, response) => author.delete_process(request, response));

app.use(function(req, res, next) {
res.status(404).send('Sorry cant find that!');
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));