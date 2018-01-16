var express = require('express')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

var path = require('path')
var logger = require('morgan')

var index = require('./routes/index')
var users = require('./routes/users')
var api = require('./routes/api')

var app = express()

//view engine setup
var handlebars = require('express-handlebars').create({
    defaultLayout: 'main',
    helpers: {
        section: function (name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});
app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
  secret: 'B54C9B842DD16'
}))

app.use('/', index)
app.use('/users', users)
app.use('/api', api)

//catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404)
    res.send('404')
});

//error handler
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500)
    res.send('500')
});

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '\n' +
        'press Ctrl-C to terminate')
});

module.exports = app