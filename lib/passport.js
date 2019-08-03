module.exports = function (app) {
    var db = require('./db');
    const bcrypt = require('bcrypt');

    var passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        console.log('serializeUser', user);
        done(null, user.username);
    });

    passport.deserializeUser(function (id, done) {
        db.query(`SELECT * FROM user WHERE id = ? `, [id], function (error, result) {
            var user = {
                username: result[0].id,
                penname: result[0].penname,
                password: result[0].password,
                profile: result[0].profile
            }

            done(null, user);
        });

    });

    passport.use(new LocalStrategy(
        function (username, password, done) {
            
            db.query(`SELECT * FROM user WHERE id = ?`, [username], function (error, result) {
                if (error) {
                    throw error;
                } else {
                    if (Object.keys(result).length > 0) {
                        var user = {
                            username: result[0].id,
                            penname: result[0].penname,
                            password: result[0].password,
                            profile: result[0].profile
                        }

                        if(user) {
                            console.log(`pass`, password);
                            console.log(`pass2`, user.password);
                            bcrypt.compare(password, user.password, function(error, result) {
                                if(error) {
                                    throw error;
                                }
                                else {
                                    if(result) {
                                        return done(null, user, {
                                            message: 'Welcome.'
                                        });
                                    }else {
                                        return done(null, false, {
                                            message: `비밀번호를 잘못 입력하셨습니다.`
                                        });
                                    }
                                    
                                }
                            });
                        }
                        
                    }else {
                        return done(null, false, {
                            message: `아이디 또는 비밀번호를 다시 확인하세요. 
                            등록되지 않은 아이디이거나, 아이디 또는 비밀번호를 잘못 입력하셨습니다.`
                        });
                    }
                }
            });
            // db.query(`SELECT * FROM user WHERE id = ? `, [username], function (error, result) {
            //     if(error) {
            //         throw error;
            //     } else {
            //         if(Object.keys(result).length > 0) {
            //             var user = {
            //                 username: result[0].id,
            //                 penname: result[0].penname,
            //                 password: result[0].password,
            //                 profile: result[0].profile  
            //             }
            //             return done(null, user, {
            //                 message: 'Welcome.'
            //             });

            //         }else {
            //             return done(null, false, {
            //                 message: `아이디 또는 비밀번호를 다시 확인하세요. 
            //                 등록되지 않은 아이디이거나, 아이디 또는 비밀번호를 잘못 입력하셨습니다.`
            //             });
            //         }
            //     }

            // });

            // if (username === authData.username) {
            //     if (password === authData.password) {

            //     } else {

            //     }
            // } else {
            //     return done(null, false, {
            //         message: '존재하지 않는 아이디입니다.'
            //     });
            // }
        }
    ));

    return passport;
}