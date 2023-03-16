const express = require(`express`)
const router = express.Router()

// const {ensureLoggedIn} = require(`../middlewares/middlewares_object`)

const db = require(`../db`)
db.connect()



router.get(`/messages/send`, (req, res) => {

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

router.delete(`/messages/:userid`, (req, res) => {
    const messageid = req.body.messageid
    const userid = req.body.receiverid
    const sqlDel = `DELETE FROM messages WHERE messageid = $1;`

    db.query(sqlDel, [messageid], (req, dbResDel) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect(`/messages/${userid}`)
        }
    })
})









module.exports = router