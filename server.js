var http = require('http')
const path = require('path')
var express = require('express')
var app = express() //creates express middleware dispatcher
const session = require('express-session')
app.use(express.urlencoded({ extended: true}))
// var sqlite3 = require('sqlite3').verbose() //verbose provides more detailed stack trace
// var db = new sqlite3.Database('data/users.db')

const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')))


app.use(session({
    secret: 'keyboard car',
    resave: false,
    saveUninitialized: true,
  }))

//view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs') //use hbs handlebars wrapper

app.locals.pretty = true //to generate pretty view-source code in browser

//read routes exports
var routes = require('./routes/index')

//ORDER MATTERS HERE
//middleware
app.get('/auth', routes.signupAndLogin); // Serves the signup/login page

//POST handlers for signup and login
app.post('/signup', routes.signupPost);
app.post('/login', routes.loginPost); 
app.use(routes.authenticate) //authenticate user



//routes
//http://localhost:3000/****
app.get('/index', routes.index)
app.get('/users', routes.users)
app.get('/songs', routes.find)
app.get('/song/*', routes.song)
app.get('/favorites', routes.favorites)

app.listen(PORT, err => {
    if (err) console.log(err)
    else {
        console.log('http://localhost:3000/index')
        console.log('http://localhost:3000/users')
        console.log('http://localhost:3000/auth')
    }
});
