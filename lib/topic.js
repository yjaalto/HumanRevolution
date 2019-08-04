var db = require('./db');
var template = require('./template.js');
var sanitizeHTML = require('sanitize-html');
const auth = require('../lib/auth');

exports.page = function (request, response) {
    var id = request.params.topicId;
    db.query(`SELECT t.id as id
                   , t.title as title
                   , LEFT(IFNULL(t.description, ''), 50) AS description
                   , a.penname as name
                   , a.id as authname
                FROM topic as t
                LEFT JOIN user as a
                  ON t.author_id = a.id
                LEFT JOIN chapter as c 
                  ON t.id = c.topicid
               WHERE t.id=?`, [id], function (error, topic) {
        if (error) {
            throw (error);
        } else {
            db.query(`SELECT c.id
                           , c.title
                           , LEFT(c.text, 100) as text 
                           , (SELECT IFNULL(COUNT(*), 0) FROM chapterlike as l WHERE l.topicid = c.topicid AND l.chapterid = c.id) as likes
                           , date_format(c.created, '%Y-%m-%d') as created 
                        FROM chapter as c
                       WHERE c.topicid =?`, [id], function (error2, chapters) {
                if (error2) {
                    throw error;
                } else {
                    response.render('topic', {
                        title: `${topic[0].title} - ${topic[0].name}`,
                        topic: topic,
                        chapters: chapters,
                        penName: auth.getPenName(request, response),
                        username: auth.getUserName(request, response),
                        avatar: auth.getProfileImage(request, response)
                    });
                }
            });
        }
    });
}



exports.create = function (request, response) {
    var post = request.body;
    db.query(`
                INSERT INTO topic 
                ( title
                , description
                , created
                , author_id
                ) 
                VALUES
                (?, ?, NOW(), ?)`,
        [post.title, post.description, request.user.username],
        function (error, result) {
            if (error) {
                throw error;
            }
            response.redirect(`/`);
        });
}

exports.update = function (request, response) {

    db.query(`SELECT * FROM topic WHERE id=?`, [request.params.topicId], function (error2, topic) {
        if (error2) {
            throw error2;
        }
        response.send(topic);
    });
}

exports.update_process = function (request, response) {
    var post = request.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    db.query(`
            UPDATE topic 
               SET title = ?
                 , description = ?
             WHERE id=?`,
        [title, description, id],
        function (error, result) {
            if (error) {
                throw error;
            }
            response.redirect(`/`);
        });
}


exports.delete_process = function (request, response) {
    var post = request.body;
    var id = post.id;
    db.query(`DELETE FROM topic WHERE id=?`, [id], function (error, result) {
        if (error) {
            throw error;
        }
        response.redirect('/');
    });
}