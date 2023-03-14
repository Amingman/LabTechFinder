const express = require("express")
const methodOverride = require(`method-override`)
const db = require(`../db`)

urlEncoded = express.urlencoded({ extended: true})
static = express.static(`public`)


const method_override = methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method
      delete req.body._method
      console.log(`Deleting....`);
      return method
    }
})

function logger(req, res, next) {
    console.log(`${req.method} ${req.url} ${new Date()}`);
    next()
}

function viewHelpers(req, res, next) {
    res.locals.isLoggedIn = () => {
        if (req.session.userID) {
            return true
        } else {
            return false
        }
    }
    next()
}


function setCurrentUser(req, res, next) {
    // req.session.userId

    const { userID } = req.session
    res.locals.currentUser = {}


    if (userID) {
        const sql = `SELECT * FROM users WHERE userid = ${userID}`
        console.log(`got ID for ${userID}`);
        db.query(sql, (err, dbRes) => {
            // console.log(dbRes);
            if (err) {
                console.log(err);
            } else {
                res.locals.currentUser = dbRes.rows[0] // This will send currentUser to all the pages, including layouts
                next()
            }
        })
    
    } else {
        console.log(`no ID`);
        next()
    }

}







expressMiddlewares = {
    urlEncoded,
    static,
    method_override,
    logger,
    viewHelpers,
    setCurrentUser
}



module.exports = expressMiddlewares