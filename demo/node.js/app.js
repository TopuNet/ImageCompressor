var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var partials = require('express-partials');
var session = require('express-session');
var func = require('./handle/functions')
var config = require("./handle/config.js");

var app = express();


//setup session
app.use(cookieParser());
app.use(session({
    secret: config.session_secret,
    resave: false,
    saveUninitialized: false
}));


// view engine setup
app.use(partials());
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
//app.set('view engine', 'html');
//app.set('view engine', 'ejs');

/*
 * 陈斌
 *【同步】判断逗号分隔的主码中是否含有某一主码。返回true或false
 * str 被比较字符串。可以为逗号分隔的多个主码，也可以是尖括号包围的多个主码
 * Pat 条件主码
 */
app.locals.checkHave = function(str, Pat) {
    return func.checkHave(str, Pat);
}

/*
 * 高京
 *【同步】省略字符串。返回省略后的字符串
 * Str 判定长度的字符串
 * Length 限定的字节数（一个汉字占2字节）
 * ShowMore 如字符串需要截取，是否显示... true-显示 false-不显示
 */
app.locals.shenglue = function(str, len, showMore) {
    return func.ShengLue(str, len, showMore);
}

/*
 * 高京
 *【同步】自动获得地址栏参数集，并拼接返回为地址栏字符串：a=1&b=2&c=3
 * query：req.query
 * Filter_Para：过滤掉的参数名（键），多个用|分隔，区分大小写
 */
app.locals.transParameters = function(query, Filter_Para) {
    return func.transParameters(query, Filter_Para);
}

/*
 * 高京
 *【同步】格式化日期时间。返回字符串
 * dt：要格式化的日期字符串
 * kind：1-标准全日期 2-标准短日期 其他-自定义字符串
 */
app.locals.dateFormat = function(dt, kind) {
    return func.dateFormat(dt, kind);
}

/*
 * 高京
 *【同步】格式化Textarea输入的字符串，替换空格和回车（注意用<%- %>输出。返回字符串
 * str：要格式化的字符串
 */
app.locals.formatTextArea = function(str) {
    return func.formatTextArea(str);
}

/*
 * 高京
 *【同步】遮盖姓名，两边各留一个字。返回新字符串
 * str：原字符串
 * mask：遮盖字符
 * length：遮盖字符出现最长次数
 */
app.locals.NameMask = function(str, mask, length) {
    return func.NameMask(str, mask, length);
}

/*
 * 高京
 *【同步】遮盖手机，根据length决定两边留几位，最少各留一位。返回新字符串
 * str：原字符串
 * mask：遮盖字符
 * length：遮盖字符出现最长次数
 */
app.locals.MobileMask = function(str, mask, length) {
    return func.MobileMask(str, mask, length);
}


/*
 * 高京
 * 数据库中读取的图片的域名前缀
 */
app.locals.ImageDomain = config.ImageDomain;


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '')));

var show = require('./routes/show.js');

app.use('/show', show);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(200);
    res.render("demo.html")
});


module.exports = app;
