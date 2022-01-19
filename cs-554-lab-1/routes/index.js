const path = require('path')
const loginRoute = require('./login')
const privateRoute = require('./private')
const signupRoute = require('./signup')
const logoutRoute = require('./logout')

const constructorMethod = (app) => {
  app.get('/', (req, res) => {
    if (!req.session.user) {
      res.render('login', {
        error: null
      })
    } else {
      res.redirect('/private')
    }
  })

  app.use('/login', loginRoute)
  app.use('/private', privateRoute)
  app.use('/signup', signupRoute)
  app.use('/logout', logoutRoute)

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' })
  })
}

module.exports = constructorMethod