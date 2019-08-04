var db = require('./db');
var template = require('./template.js');
var sanitizeHTML = require('sanitize-html');
const {
    convertHtmlToDelta
} = require('node-quill-converter');
const auth = require('../lib/auth');

exports.page = function (request, response) {
    var topicId = request.params.topicId;
    var chapterId = request.params.chapterId;
    var isLogin = request.user ? true : false;
    console.log(isLogin);
    db.query(`SELECT c.id 
                   , t.title as topic_title
                   , c.title 
                   , date_format(c.created, '%Y-%m-%d') as created 
                   , c.content 
                   , a.penname as name
                   , t.id as topic_id
                   , a.id as authusername
                   , CASE WHEN l.userid IS NULL THEN 'N' ELSE 'Y' END AS islike 
                FROM topic as t
               INNER JOIN chapter as c
                  ON t.id = c.topicid
               INNER JOIN user as a 
                  ON t.author_id = a.id
                LEFT JOIN chapterlike as l 
                  ON c.topicid = l.topicid
			     AND c.id = l.chapterid 
                 AND l.userid = ?
               WHERE t.id = ?
                 AND c.id = ?`, [isLogin ? request.user.username : '', topicId, chapterId], function (error, chapter) {
        if (error) {
            throw (error);
        } else {
            // 조회수 
            db.query(`UPDATE chapter 
                         SET views = IFNULL(views, 0) + 1 
                       WHERE topicid = ? 
                         AND id = ? `, [topicId, chapterId], function (error2) {
                if (error2) {
                    throw (error2);
                }
                response.render('chapter', {
                    title: `${chapter[0].title}`,
                    chapter: chapter,
                    penName: auth.getPenName(request, response),
                    username: auth.getUserName(request, response),
                    likeClass: chapter[0].islike == 'Y' ? 'liked' : ''
                });
            });
        }
    });
}

exports.create = function (request, response) {
    var id = request.params.topicId;
    response.render('write', {
        title: '새로 작성하기',
        chapter_title: '',
        topicId: id,
        chapterId: '',
        state: 'C',
        chapter: {},
        delta: {},
        penName: auth.getPenName(request, response)
    });
}

exports.create_process = function (request, response) {
    var post = request.body;
    db.query(`
                INSERT INTO chapter 
                ( topicid
                , title
                , text
                , content
                , created) 
                VALUES
                (?, ?, ?, ?, NOW())`,
        [post.topic_id, post.title, post.text, post.content],
        function (error, result) {
            if (error) {
                throw error;
            }
            response.redirect(`/topic/${post.topic_id}`);
        });
}
// exports.create = function (request, response) {
//     var id = request.params.topicId;
//     response.render('write', {
//         title: '새로 작성하기',
//         id: id
//     });
//     // db.query('SELECT * FROM topic', function (error, topics) {
//     //     db.query(`SELECT * FROM author`, function (error2, authors) {


//     // var title = 'Create';
//     // var list = template.list(topics);
//     // var html = template.HTML(sanitizeHTML(title), list,
//     //     `<form action="/topic/create_process" method="post">
//     //     <p><input type="text" name="title" placeholder="title"></p>
//     //     <p>
//     //       <textarea name="description" placeholder="description"></textarea>
//     //     </p>
//     //     <p>
//     //         ${template.authorSelect(authors)}
//     //     </p>
//     //     <p>
//     //       <input type="submit">
//     //     </p>
//     //   </form>`,
//     //     `<a href="/topic/create">create</a>`
//     // );
//     // response.send(html);
//     //     });
//     // });
// }

// exports.create_process = function (request, response) {
//     var post = request.body;
//     db.query(`
//                 INSERT INTO chapter 
//                 ( topicid
//                 , title
//                 , text
//                 , content
//                 , created) 
//                 VALUES
//                 (?, ?, ?, ?, NOW())`,
//         [post.id, post.title, post.text, post.content],
//         function (error, result) {
//             if (error) {
//                 throw error;
//             }
//             response.redirect(`/topic/page/${post.id}`);
//         });
// }

exports.update = function (request, response) {
    var topicId = request.params.topicId;
    var chapterId = request.params.chapterId;

    db.query(`SELECT title
                   , content
                FROM chapter
               WHERE topicid = ?
                 AND id = ?`, [topicId, chapterId], function (error, chapter) {
        if (error) {
            throw error;
        }
        response.render('write', {
            title: '수정',
            chapter_title: chapter[0].title,
            topicId: topicId,
            state: 'U',
            chapterId: chapterId,
            chapter: chapter,
            delta: convertHtmlToDelta(chapter[0].content),
            penName: auth.getPenName(request, response)
        });
    });
}

exports.update_process = function (request, response) {
    var post = request.body;
    console.log(`text${post.text}`);
    db.query(`
            UPDATE chapter 
               SET title = ?
                 , text = ?
                 , content = ?
             WHERE topicid= ?
               AND id = ?`,
        [post.title, post.text, post.content, post.topic_id, post.chapter_id],
        function (error, result) {
            if (error) {
                throw error;
            }

            response.redirect(`/chapter/view/${post.topic_id}/${post.chapter_id}`);
        });
}

exports.delete_process = function (request, response) {

    var post = request.body;
    var topicId = post.topic_id;
    var chapterId = post.chapter_id;
    db.query(`DELETE FROM chapter 
               WHERE topicid= ? AND id=?`, [topicId, chapterId], function (error, result) {
        if (error) {
            throw error;
        }
        response.redirect(`/topic/${topicId}`);
    });
}