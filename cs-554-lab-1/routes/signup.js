const express = require('express')
const router = express.Router()
const { createUser } = require('../data/users')

router.get('/', async (req, res) => {
    if (req.session.user) {
        res.redirect('/private')
    } else {
        res.render('signup')
    }
})

router.post('/', async (req, res) => {

    const { username, password } = req.body

    try {
        const { userInserted } = await createUser(username, password)
        if(userInserted) {
            res.redirect('/')
        }
        else {
            res.render('signup', {
                error: "Internal Server Error",
                status: 500
            })
        }
    } catch(e) {
        res.render('signup', {
            error: e,
            status: 400
        })
    }
    
    

})
  
module.exports = router