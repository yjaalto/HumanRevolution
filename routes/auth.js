var express = require('express');
var router = express.Router();
const auth = require('../lib/auth');
const db = require('../lib/db');
const bcrypt = require('bcrypt');
const saltRounds = 10;


module.exports = function (passport, upload) {
    router.get('/login', function (request, response) {
        auth.home(request, response);
    });

    router.post('/update_process', function (request, response) {
        let post = request.body;
        let id = post.id;
        let penName = post.penName;
        let comment = post.comment;

        console.log(post);
        db.query(`UPDATE user
                     SET penname = ?
                       , profile = ?
                   WHERE id = ?`, [penName, comment, id], function (err, result) {
            if (err) {
                throw err;
            }

            request.session.passport.user.penName = penName;

            response.redirect('/');
        });
    });

    router.post('/login_process',
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/auth/login',
            failureFlash: true
        }));

    router.get('/register', function (request, response) {
        auth.register(request, response);
    });

    router.post('/register_process', upload.single('profile'), function (request, response) {
        var post = request.body;
        var username = post.username;
        var penname = post.penname;
        var password = post.password;
        var comment = post.comment;
        let filename = request.file.filename;

        db.query(`SELECT * FROM user WHERE id = ?`, [username], function (errorDuplicate, result) {
            if (errorDuplicate) {
                throw errorDuplicate;
            } else {
                if (Object.keys(result).length > 0) {
                    request.flash('error', '중복된 아이디입니다.');
                    response.redirect('/auth/register');
                } else {
                    bcrypt.hash(password, saltRounds, function (errorBcrypt, hash) {
                        if (errorBcrypt) {
                            throw errorBcrypt;
                        } else {
                            db.query(`
                                    INSERT INTO user 
                                    ( id
                                    , penname
                                    , password
                                    , profile
                                    , created
                                    , file) 
                                    VALUES
                                    ( ?
                                    , ?
                                    , ?
                                    , ?
                                    , NOW()
                                    , ?)`,
                                [username, penname, hash, comment, filename],
                                function (error, result) {
                                    if (error) {
                                        throw error;
                                    }
                                    var user = {
                                        username: username,
                                        penname: penname,
                                        password: hash,
                                        profile: comment,
                                        image: filename
                                    }
                                    // 바로 로그인 
                                    request.login(user, function (err) {
                                        return response.redirect('/');
                                    });
                                });
                        }
                    });

                }
            }
        })

    });

    return router;
};