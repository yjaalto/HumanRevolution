var db = require('./db');
var template = require('./template.js');
var sanitizeHTML = require('sanitize-html');

exports.home = function (response) {
    db.query('SELECT * FROM topic', function (error, topics) {
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(topics);
        var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}
            <img src="/images/hello.jpg" style="width:300px; display:block;">`,
            `<a href="/topic/create">create</a>`
        );
        return html;
    });
}

exports.page = function (request, response) {
    var id = request.params.topicId;
    db.query(`SELECT t.id as id
                   , t.title as title
                   , LEFT(IFNULL(t.description, ''), 50) AS description
                   , a.name as name
                FROM topic as t
                LEFT JOIN author as a
                  ON t.author_id = a.id
                LEFT JOIN chapter as c 
                  ON t.id = c.topicid
               WHERE t.id=?`, [id], function (error, topic) {
        if (error) {
            throw (error);
        } else {
            db.query(`SELECT id
                           , title
                           , LEFT(text, 100) as text 
                        FROM chapter
                       WHERE topicid =?`, [id], function (error2, chapters) {
                if (error2) {
                    throw error;
                } else {
                    response.render('topic', {
                        title: `${topic[0].title} - ${topic[0].name}`,
                        topic: topic,
                        chapters: chapters
                    });

                    // var title = topic[0].title;
                    // var description = topic[0].description;
                    // var list = template.list(topics);
                    // var html = template.HTML(title, list,
                    //     `<h2>${sanitizeHTML(title)}</h2>
                    // ${sanitizeHTML(description)}
                    // <p>by ${sanitizeHTML(topic[0].name)}</p>`,
                    //     ` <a href="/topic/create">create</a>
                    // <a href="/topic/update/${id}">update</a>
                    // <form action="/topic/delete_process" method="post">
                    // <input type="hidden" name="id" value="${id}">
                    // <input type="submit" value="delete" id="btnDel">
                    // </form>`
                    // );
                    // response.writeHead(200);
                    // response.end(html);
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
        [post.title, post.description, post.author],
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
            } else {
            }
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