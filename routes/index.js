var db = require('../lib/db');

var express = require('express');
var router = express.Router();

var query = `SELECT T.id as id
                  , T.title as title 
                  , ISNULL(T.description, '') as description
                  , A.name as name 
               FROM topic AS T 
              INNER JOIN author AS A 
                 ON T.author_id = A.id`

db.query(query, function (error, topics) {
    db.query(`SELECT * FROM author`, function (error2, authors) {
    router.get('/', (req, res) => res.render('index', {title: 'My-New-Human-Revolution', topics:topics, authors:authors} ));
    });
});

module.exports = router;