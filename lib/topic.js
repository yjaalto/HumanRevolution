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
        response.send(html);
    });
}

exports.page = function (request, response) {
    var id = request.params.pageId; /* url.parse(_url, true).query; */
    db.query('SELECT * FROM topic', function (error, topics) {
        if (error) {
            throw error;
        }
        db.query(`SELECT * 
                    FROM topic 
                    LEFT JOIN author 
                      ON topic.author_id = author.id
                   WHERE topic.id=?`, [id], function (error2, topic) {
            if (error2) {
                throw(error2);
            } else {
                var title = topic[0].title;
                var description = topic[0].description;
                var list = template.list(topics);
                var html = template.HTML(title, list,
                    `<h2>${sanitizeHTML(title)}</h2>
                ${sanitizeHTML(description)}
                <p>by ${sanitizeHTML(topic[0].name)}</p>`,
                    ` <a href="/topic/create">create</a>
                <a href="/topic/update/${id}">update</a>
                <form action="/topic/delete_process" method="post">
                <input type="hidden" name="id" value="${id}">
                <input type="submit" value="delete" id="btnDel">
                </form>`
                );
                response.writeHead(200);
                response.end(html);
            }
        });

    });
}

exports.create = function (request, response) {
    db.query('SELECT * FROM topic', function (error, topics) {
        db.query(`SELECT * FROM author`, function (error2, authors) {
            var title = 'Create';
            var list = template.list(topics);
            var html = template.HTML(sanitizeHTML(title), list,
                `<form action="/topic/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                  <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                    ${template.authorSelect(authors)}
                </p>
                <p>
                  <input type="submit">
                </p>
              </form>`,
                `<a href="/topic/create">create</a>`
            );
            response.send(html);
        });
    });
}

exports.create_process = function (request, response) {
    var post = request.body;
    db.query(`
                INSERT INTO topic 
                ( title
                , description
                , created
                , author_id) 
                VALUES
                (?, ?, NOW(), ?)`,
        [post.title, post.description, post.author],
        function (error, result) {
            if (error) {
                throw error;
            }
            response.redirect(`/topic/page/${result.insertId}`);
        });
}

exports.update = function (request, response) {
    db.query('SELECT * FROM topic', function (error, topics) {
        if (error) {
            throw error;
        }
        db.query(`SELECT * FROM topic WHERE id=?`, [request.params.pageId], function (error2, topic) {
            if (error2) {
                throw error2;
            }

            db.query(`SELECT * FROM author`, function (error2, authors) {
                var list = template.list(topics);
                var html = template.HTML(sanitizeHTML(topic[0].title), list,
                    `<form action="/topic/update_process" method="post">
                    <input type="hidden" name="id" value="${topic[0].id}">
                    <p><input type="text" name="title" placeholder="title" value="${sanitizeHTML(topic[0].title)}"></p>
                    <p>
                    <textarea name="description" placeholder="description">${sanitizeHTML(topic[0].description)}</textarea>
                    </p>
                    <p>${template.authorSelect(authors, topic[0].author_id)}</p>
                    <p>
                    <input type="submit">
                    </p>
                </form>`,
                    `<a href="/topic/create">create</a> <a href="/topic/update/${topic[0].id}">update</a>`
                );
                response.writeHead(200);
                response.end(html);
            });
        });
    });
}

exports.update_process = function (request, response) {

    var post = request.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    var author_id = post.author;
    db.query(`
            UPDATE topic 
               SET title = ?
               ,   description = ?
               ,   author_id = ?
             WHERE id=?`,
        [title, description, author_id, id],
        function (error, result) {
            if (error) {
                throw error;
            }

            response.redirect(`/topic/page/${id}`);
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