var db = require('../lib/db');

var express = require('express');
var router = express.Router();
const topic = require('../lib/topic');

var query = `SELECT T.title as title 
                  , A.name as name 
               FROM topic AS T 
              INNER JOIN author AS A 
                 ON T.author_id = A.id`

db.query(query, function (error, topics) {
    router.get('/', (req, res) => res.render('index', {title: 'My-New-Human-Revolution', topics:topics} ));
});

//topic.home(res)
module.exports = router;