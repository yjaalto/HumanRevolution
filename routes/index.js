var db = require('../lib/db');
const auth = require('../lib/auth');

var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    var query = `SELECT T.id as id
                      , T.title as title 
                      , IFNULL(T.description, '') as description
                      , A.penname as name 
                      , (SELECT COUNT(*) FROM chapter WHERE topicid = t.id) as chaptercnt
                      , (SELECT IFNULL(SUM(views), 0) FROM chapter WHERE topicid = t.id) as views
                      , (SELECT IFNULL(COUNT(*), 0) FROM chapterlike WHERE topicid = t.id) as likes
                      , a.file
                   FROM topic AS T 
                  INNER JOIN user AS A 
                     ON T.author_id = A.id`

    db.query(query, function (error, topics) {
        res.render('index', {
            title: 'My-New-Human-Revolution',
            topics: topics,
            penName: auth.getPenName(req, res),
            avatar: auth.getProfileImage(req, res)
        });
    });
});

module.exports = router;