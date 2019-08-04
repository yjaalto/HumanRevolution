const express = require('express');
const app = express();
const bodyParser = require('body-parser'),
    fileUpload = require('express-fileupload');
app.use(bodyParser.json());

const flash = require('connect-flash');

var helmet = require('helmet');
app.use(helmet());
const session = require('express-session');
const FileStore = require('session-file-store')(session);

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.static('css'));
app.use(express.static('js'));
app.use(bodyParser.urlencoded({
    extended: false
}));


// 기본 path를 /public으로 설정(css, javascript 등의 파일 사용을 위해)
app.use(express.static(__dirname + '/public'));
app.use(fileUpload());

var sessionOptions = {
    HttpOnly: true,
    secret: 'sdfsejwoerjqworeiqewq',
    resave: false,
    saveUninitialized: true
    // store: new FileStore(),
    // name: 'my.contect.sid'
};

app.use(session(sessionOptions));

app.use(flash());
const passport = require('./lib/passport')(app);

const topicRouter = require('./routes/topic');
const indexRouter = require('./routes/index');
const chapterRouter = require('./routes/chapter');
const authRouter = require('./routes/auth')(passport);

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/chapter', chapterRouter);
app.use('/auth', authRouter);

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

const db = require('./lib/db');
app.post('/liked', function(request, response) {
    const post = request.body;
    db.query(`
            INSERT INTO chapterlike 
            ( topicid
            , chapterid
            , userid
            , liketime
            ) 
            VALUES
            ( ?
            , ?
            , ?
            , NOW())`,
        [post.topicId, post.chapterId, post.username],
        function (error, result) {
            if (error) {
                throw error;
            }
        });
});
app.post('/unliked', function(request, response) {
    const post = request.body;
    db.query(`
            DELETE from chapterlike 
             WHERE topicid = ? 
               AND chapterid = ?
               AND userid = ?`,
        [post.topicId, post.chapterId, post.username],
        function (error, result) {
            if (error) {
                throw error;
            }
        });
});

app.use(function (req, res, next) {
    res.status(404).send('Sorry cant find that!');
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));