var Index = require('../app/controllers/index');
var Movie = require('../app/controllers/movie');
var User = require('../app/controllers/user');
var _ = require('underscore');
//导出路由模块
module.exports=function (app) {
    //从user里面拿出user
    app.use(function (req,res,next) {
        console.log('当前session 里的用户是 ：');
        console.log(req.session.user);
        var _user = req.session.user;
        app.locals.user = _user;
        return next();
    })

    //如果是url的话用get  如果是表单或其它的话用对应的method
    app.get('/',Index.index);
    app.post('/user/signup',User.signup)
    app.post('/user/signin',User.signin)
    app.get('/signup',User.showSignup)
    app.get('/signin',User.showSignin)
    app.get('/user/logout',User.logout)
    app.get('/admin/userlist',User.signinRequired,User.adminRequired,User.userlist)
    app.get('/admin/movie/list',Movie.list)
    app.get('/movie/:id',Movie.detail)
    app.get('/admin/movie/new',User.signinRequired,User.adminRequired,Movie.new)
    app.get('/admin/movie/update/:id',User.signinRequired,User.adminRequired,Movie.update)
    app.post('/admin/movie',User.signinRequired,User.adminRequired,Movie.save)
    app.delete('/admin/movie/deleteById',User.signinRequired,User.adminRequired,Movie.del)
}