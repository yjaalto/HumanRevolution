const express = require('express');
const app = express();
const topic = require('./lib/topic');
const author = require('./lib/author');
const bodyParser = require('body-parser')
    , busboy = require('then-busboy')
    , fileUpload = require('express-fileupload');

const topicRouter = require('./routes/topic');
const indexRouter = require('./routes/index');
const authorRouter = require('./routes/author');
var helmet = require('helmet');
// app.use(helmet());

app.set('view engine', 'ejs');
app.set('views', './views');

// app.get('/', function (req, res) {
//     res.render('index');
// });


app.use(express.static('public'));
app.use(express.static('css'));
app.use(express.static('js'));
app.use(bodyParser.urlencoded({
    extended: false
}));

// 기본 path를 /public으로 설정(css, javascript 등의 파일 사용을 위해)
app.use(express.static(__dirname + '/public'));
app.use(fileUpload());


 app.use('/', indexRouter);
// app.use('/topic', topicRouter);

// app.get('/authors', (request, response) => author.home(request, response));
// app.use('/author', authorRouter);


app.use(function (req, res, next) {
    res.status(404).send('Sorry cant find that!');
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));