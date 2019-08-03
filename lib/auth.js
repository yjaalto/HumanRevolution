exports.home = function (request, response) {
    var fmsg = request.flash();
    var feedback = '';
    if (fmsg.error) {
        feedback = fmsg.error[0];
    }
    response.render('login', {
        title: `로그인`,
        feedback: feedback
    });
}

exports.register = function (request, response) {
    var fmsg = request.flash();
    var feedback = '';
    if(fmsg.error) {
        feedback = fmsg.error[0];
    }
    response.render('register', {
        feedback: feedback 
    });
}

// exports.login = function (request, response) {
//     var post = request.body;
//     var id = post.id;
//     var password = post.pwd;

//     if (id === authData.id && password === authData.password) {
//         request.session.is_logined = true;
//         request.session.nickname = authData.nickname;
//         request.session.save(function () {
//             response.redirect('/');
//         });
//     } else {
//         response.send('Who?');
//     }
//     // db.query(`
//     //             INSERT INTO topic 
//     //             ( title
//     //             , description
//     //             , created
//     //             , author_id
//     //             ) 
//     //             VALUES
//     //             (?, ?, NOW(), ?)`,
//     //     [post.title, post.description, post.author],
//     //     function (error, result) {
//     //         if (error) {
//     //             throw error;
//     //         }
//     //         response.redirect(`/`);
//     //     });
// }

exports.isLogin = function (request, response) {
    if (request.user) {
        return true;
    } else {
        return false;
    }
}

exports.getPenName = function (request, response) {
    if (this.isLogin(request, response)) {
        return `${request.user.penname}`;
    }
}
exports.getUserName = function (request, response) {
    if (this.isLogin(request, response)) {
        return `${request.user.username}`;
    }
}