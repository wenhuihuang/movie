var User = require('../models/user');
exports.signup=function (req,res) {
    console.log('进入注册！')
    var _user = req.body.user;
    //var _user = req.param('user');
    User.find({name:_user.name},function (err,user) {
        if(err) {
            console.log(err);
        }
        if(user){
            return res.redirect('/signin');
        }else{
            var user = new User(_user);
            user.save(function (err,user) {
                if(err){
                    console.log(err)
                }
                res.redirect('/admin/userlist');
            })
        }

    })

}
exports.showSignup = function (req,res) {
    res.render('signup',{
        title:"用户注册"

    })
}

exports.showSignin = function (req,res) {
    res.render('signin',{
        title:'用户登录'
    })
}

//signin
exports.signin=function (req,res) {
    console.log('进入登录')
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;
    User.findOne({"name":name},function (err,user) {
        if(err){
            console.log(err);
        }
        if(!user){

            return res.redirect('/signup');
        }
        user.comparePassword(password,function (err,isMatch) {
            if(err){
                console.log(err);
            }
            if(isMatch){
                console.log('登录成功');
                req.session.user=user;
                return res.redirect('/')
            }else{
                return res.redirect('/signin')
                console.log('password is not matched!');
            }
        })
    })
}

//logout
exports.logout=function (req,res) {
    delete req.session.user;
    //delete app.locals.user;
    res.redirect('/');
}

//userlist page
exports.userlist=function (req,res) {
    User.fetch(function (err,users) {
        if(err){
            console.log("err");
        }
        res.render('userlist',{
            title:'用户列表',
            users:users
        })
    })
}

//用户登录中间件 判断用户是否登录
exports.signinRequired = function (req,res,next) {
    var user = req.session.user;
    if(!user){
        console.log('用户没有登录')
        return res.redirect('/signin');
    }
}

//判断用户类型中间件

exports.adminRequired = function (req,res,next) {
    var user = req.session.user;
    if(user.role <= 10){
        console.log('不是admin');
    }else{
        console.log('是admin');
    }
    next();
}
