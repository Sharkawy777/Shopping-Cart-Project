const express = require('express')
const path = require('path')
const mongoose = require('mongoose');
const config = require('./config/database');
const bodyParser = require('body-parser')
const session = require('express-session')
const expressValidator = require('express-validator')
const fileUpload = require('express-fileUpload')
//connect to db
mongoose.connect(config.database);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'))
db.once('open', function () {
    console.log('Connected to MongoDB!')
})

//init app
var app = express()



//view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

//Set publuc folder

//app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(__dirname + '../public'));

// Set global errors vaiables
app.locals.errors =null;

/*
app.get('/', function (req, res) {
    res.render('index',{
        title: 'Home'
    })
})
*/
// Set express-fileUpload
app.use(fileUpload())

// Body Parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
}))


//
// express validator


app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;
        while (namespace.length) {
            formParam+= '{'+namespace.shift()+'}';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        }
    },
    customValidators: {
        isImage: function (value, filename) {
            var extension = (path.extname(filename)).toLowerCase();
            switch (extension) {
                case '.jpg':
                    return '.jpg';
                case '.jpeg':
                    return '.jpeg';
                case '.png':
                    return '.png';
                case '':
                    return '.jpg';
                default:
                    return false;
            }
        }
    }

}))

// express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Set routes
const pages = require('./routes/pages.js')
const adminPages = require('./routes/admin_pages.js')
const adminCategories = require('./routes/admin_categories')
const adminProducts = require('./routes/admin_products')

app.use('/admin/pages', adminPages)
app.use('/admin/categories', adminCategories)
app.use('/admin/products', adminProducts)
app.use('/', pages)
//

// start the server
var port = 3000
app.listen(port, function () {
    console.log('Server Listening on port: ' + port)
})