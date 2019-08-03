var db = require('../lib/db');
const auth = require('../lib/auth');

var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    console.log('/name', req.user);
    var query = `SELECT T.id as id
                      , T.title as title 
                      , IFNULL(T.description, '') as description
                      , A.penname as name 
                      , (SELECT COUNT(*) FROM chapter WHERE topicid = t.id) as chaptercnt
                      , (SELECT IFNULL(SUM(views), 0) FROM chapter WHERE topicid = t.id) as views
                   FROM topic AS T 
                  INNER JOIN user AS A 
                     ON T.author_id = A.id`

    db.query(query, function (error, topics) {
        db.query(`SELECT * FROM author`, function (error2, authors) {
            res.render('index', {
                title: 'My-New-Human-Revolution',
                topics: topics,
                authors: authors,
                penName: auth.getPenName(req, res)
            });
        });
    });
});

module.exports = router;