const express = require('express')
const router = express.Router()
const { checkUser } = require('../data/users')

router.post('/', async (req, res) => {

    const { username, password } = req.body

    try {
        await checkUser(username, password)
        req.session.user = { username: username.toLowerCase() }
    } catch(e) {
        res.render('login', {
            error: e
        })
    }
    
    if(req.session.user) {
        res.redirect('/private')
    }

})
  
module.exports = router