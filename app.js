/**
 * Created by hui on 2016-10-16.
 *
 */
/**
 * var session = require('express-session');
 var MongoStore = require('connect-mongo')(session);

 app.use(session({
    secret: 'foo',
    store: new MongoStore(options)
}));
 而 Express 3.x 中是这样的:

 var MongoStore = require('connect-mongo')(express);

 app.use(express.session({
    secret: 'foo',
    store: new MongoStore(options)
}));
 */

var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);//session 持久化

var morgan = require('morgan');

var port = process.env.PORT || 3000;
var app = express();

var dbUrl = 'mongodb://127.0.0.1:27017/movie';
mongoose.connect(dbUrl);

app.set('views','./app/views/pages');
app.set('view engine','jade');
app.use(require('body-parser').urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
    secret:'movie',
    store: new mongoStore({
      url:dbUrl,
      collection:'sessions'
    })
}))
app.use(express.static(path.join(__dirname,'publics')));
app.listen(port);

console.log('movie started on '+port );
//引用路由模块
require('./config/routes')(app);


//生产环境
if('development' === app.get('env')){
  app.set('showStackError',true);
  app.use(morgan(':method :url :status'));
  app.locals.pretty = true;
  mongoose.set('debug',true);
}