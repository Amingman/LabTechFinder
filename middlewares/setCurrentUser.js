const db = require(`../db`) // by default it will look for a file named index of the same file type


function setCurrentUser(req, res, next) {
    // req.session.userId

    const { userID } = req.session
    res.locals.currentUser = {}


    if (userID) {
        const sql = `SELECT * FROM users WHERE id = ${userID}`
        console.log(`got ID`);
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

module.exports = setCurrentUser