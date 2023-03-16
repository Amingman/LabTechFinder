const express = require(`express`)
const router = express.Router()

// const {ensureLoggedIn} = require(`../middlewares/middlewares_object`)

const db = require(`../db`)
db.connect()



router.get(`/send/:userid`, (req, res) => {
    const userid = req.params.userid
    const sqlUser = `SELECT * FROM users WHERE userid = $1`

    db.query(sqlUser, [userid], (err, dbResUser) => {
        if (err) {
            console.log(err);
        } else {
            let userData = dbResUser.rows[0]
            res.render(`send`, {userData, session: req.session})
        }
    })

})

router.post(`/messages/:userid`, (req, res) => {
    const userid = req.body.receiverid
    const labid = req.body.labid
    const sender = req.body.sender
    const subject = req.body.subject
    const message = req.body.message
    
    const sqlMess = `INSERT INTO messages (labid, sender, receiverid, subject, message) VALUES ($1, $2, $3, $4, $5)`

    db.query(sqlMess, [labid, sender, userid, subject, message], (err, dbResMess) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect(`/user/${userid}`)
        }
    })    
})




router.get(`/messages/:userid`, (req, res) => {
    const userid = req.params.userid
    const sqlMessage = `SELECT * FROM messages WHERE receiverid = $1`
    let data = {}
    db.query(sqlMessage, [userid], (err, dbResMess) => {
        if (err) {
            console.log(err);
        } else {
            data.userid = userid
            data.messages = dbResMess.rows

            res.render(`messages`, {data, session: req.session})
        }
    })

})

router.delete(`/messages`, (req, res) => {
    const messageid = req.body.messageid
    const userid = req.body.userid
    const sqlDel = `DELETE FROM messages WHERE messageid = $1;`

    db.query(sqlDel, [messageid], (err, dbResDel) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect(`/social/messages/${userid}`)
            // res.redirect(`/social/messages/${userid}`)
        }
    })
})








module.exports = router