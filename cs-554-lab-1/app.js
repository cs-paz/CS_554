const express = require("express")
const app = express()
const configRoutes = require('./routes')
const static = express.static(__dirname + '/public')
const session = require('express-session')
const exphbs = require('express-handlebars')
const port = 3000

app.use(express.json())

app.use(
  session({
    name: 'AuthCookie',
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 60000 }
  })
)

app.use('/public', static)

app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

const logger = (req, res, next) => {
  console.log(`[${new Date().toUTCString()}] ${req.method} ${req.originalUrl} ${req.session.user ? "(Authenticated User)" : "(Non-Authenticated User)"}`)
  next()
}

app.use(logger)

configRoutes(app)

app.listen(port, () => {
  console.log("We've now got a server!")
  console.log(`Your routes will be running on http://localhost:${port}`)
})