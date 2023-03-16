const express = require(`express`)
const router = express.Router()
const bcrypt = require(`bcrypt`);

const db = require(`../db`)
db.connect()


router.get(`/login`, (req, res) => {
    res.render(`login`, {alert:null, session: req.session})
})


router.post(`/`, (req, res) => {
    // res.send(req.body)
    const userEmail = req.body.userEmail
    const password = req.body.password
    // Check existence
    const sqlUser = `SELECT * FROM users WHERE email = $1`
    db.query(sqlUser, [userEmail], (err, dbResUser) => {
        if (err) {
            console.log(err);
        } else {
            if (dbResUser.rows.length == 0) {
                res.render(`login`, {alert:'User does not exist', session: req.session})
            } else {
                const userName = dbResUser.rows[0].name
                const digPassword = dbResUser.rows[0].digpassword
                const labid = dbResUser.rows[0].labid
                const userid = dbResUser.rows[0].userid
                const userAccess = dbResUser.rows[0].accesslevel
                // res.render(`login`, {alert:''})
                // res.send(dbResUser.rows[0])
                

                bcrypt.compare(password, digPassword, (err, result) => {
                    if (result) {
                        // checked your id
                        req.session.activeLabId = labid
                        req.session.activeUserId = userid
                        req.session.activeUserName = userName
                        req.session.activeUserEmail = userEmail
                        req.session.activeUserAccess = userAccess
                        
                        // res.send(req.session)
    
                        res.redirect(`/`)
                    } else {
                        res.render(`login`, {session: req.session})
                    }
                })
    
            }
        }
    })
})




router.delete(`/logout`, (req, res) => { // change this to delete instead of get when got time
    req.session.destroy(() => {
        res.redirect(`/`)
    })
})



module.exports = router