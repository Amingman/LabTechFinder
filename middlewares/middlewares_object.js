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
    console.log(`${req.method} ${req.url} ${String(new Date()).split(` (`)[0]
}`);
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

    const { activeUserId } = req.session
    // res.locals.currentUser = {}


    if (activeUserId) {
        // const sql = `SELECT * FROM users WHERE userid = $1`
        console.log(`Receive ID for ${req.session.activeUserName} at ID: ${req.session.activeUserId}`);
        res.locals.activeLabId = req.session.activeLabId
        res.locals.activeUserId = req.session.activeUserId
        res.locals.activeUserName = req.session.activeUserName
        res.locals.activeUserEmail = req.session.activeUserEmail
        res.locals.activeUserAccess = req.session.activeUserAccess
        console.log((res.locals));
        next()
        // db.query(sql, (err, dbRes) => {
        //     // console.log(dbRes);
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         res.locals.currentUser = dbRes.rows[0] // This will send currentUser to all the pages, including layouts
        //         next()
        //     }
        // })
        
    } else {
        console.log(`no ID`);
        res.locals.activeLabId = undefined
        res.locals.activeUserId = undefined
        res.locals.activeUserName = undefined
        res.locals.activeUserEmail = undefined
        res.locals.activeUserAccess = undefined
        console.log((res.locals));
        next()
    }

}

function ensureLoggedIn(req, res, next) {
    if (req.session.activeUserId) return next()
    res.redirect("/login")
}



expressMiddlewares = {
    urlEncoded,
    static,
    method_override,
    logger,
    viewHelpers,
    setCurrentUser,
    ensureLoggedIn
}



module.exports = expressMiddlewares