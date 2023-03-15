const express = require(`express`)
// const router = express.Router()
const router = express.Router()
const bcrypt = require(`bcrypt`);

// const {ensureLoggedIn} = require(`../middlewares/middlewares_object`)

const db = require(`../db`)
db.connect()


// router.get(`/`, (req, res) => {

//     res.render(`lab_search`)
// })

router.get(`/`, (req, res) => {
    res.render(`lab_search`)
})

router.get(`/lab_search`, (req, res) => {
    const sql = `SELECT * FROM laboratories WHERE labid > 1;`

    db.query(sql, (err, dbRes) => {
        if (err) {
            console.log(err);
        }
        let data = {}
        data.title = 'Laboratories'
        data.label = 'lab'
        data.entries = dbRes.rows
        res.render(`search`, {data})
    })

})

router.post(`/lab_search/byname`, (req, res) => {
    let name = req.body.name
    let names = name.split(` `)
    let stringName  = [] // The search terms as array
    names.forEach(name => {
        stringName.push(`%${name.toLowerCase()}%`)
    });

    // Dynamic string query sanitisation setup
    let sql = `SELECT * FROM laboratories WHERE LOWER(name) LIKE `
    for (let i = 0; i < stringName.length; i++) {
        sql = `${sql} $${i+1}`
        if (i < stringName.length - 1) {
            sql = `${sql} OR LOWER(name) LIKE `
        }
    }    
    sql = `${sql};`

    db.query(sql, stringName, (err, dbRes) => {
        if (err) {
            console.log(err);
        }
        let data = {}
        data.title = 'Laboratories'
        data.label = 'lab'
        data.entries = dbRes.rows
        res.render(`search`, {data})
    })
})


router.post(`/lab_search/bypi`, (req, res) => {
    let name = req.body.pi
    let names = name.split(` `)
    let stringName  = []
    names.forEach(name => {
        stringName.push(`%${name.toLowerCase()}%`) 
    });

    // Dynamic string query sanitisation setup
    let sql = `SELECT labid FROM users WHERE role ='PI' AND LOWER(name) LIKE `
    for (let i = 0; i < stringName.length; i++) {
        sql = `${sql} $${i+1}`
        if (i < stringName.length - 1) {
            sql = `${sql} OR role ='PI' AND LOWER(name) LIKE `
        }
    }    
    sql = `${sql};`

    db.query(sql, stringName, (err, dbRes) => {
        if (err) {
            console.log(err);
        }
        let ids = dbRes.rows
        let stringId = []
        ids.forEach(id => {
            stringId.push(id.labid)
        })

        // Dynamic string query sanitisation setup
        sql = `SELECT * FROM laboratories WHERE labid =`
        for (let i = 0; i < stringId.length; i++) {
            sql = `${sql} $${i+1}`
            if (i < stringId.length - 1) {
                sql = `${sql} OR labid =`
            }
        }    
        sql = `${sql};`
        
        db.query(sql, stringId, (err, dbRes2) => {
            if (err) {
                console.log(err);
            }
            let data = {}

            data.title = 'Laboratories'
            data.label = 'lab'
            data.entries = dbRes2.rows
            res.render(`search`, {data})
        })
    })

})

router.get(`/new`, (req, res) => {
    let alert = ''
    res.render(`lab_add`, {alert})
})

// Create new Lab and render the lab details page after
router.post(`/`, (req, res) => {
    const labName = req.body.labName
    const labEmail = req.body.labEmail
    const labDesc = req.body.description
    const piName = req.body.piName
    const piEmail = req.body.piEmail
    const piImage = req.body.piImage
    const piPass = req.body.piPass
    const confirm = req.body.confirm

    if (piPass != confirm) {
        res.render(`lab_add`, {alert:`Password does not match.`})
    } else {

        const sqlLab = `INSERT INTO laboratories (name, description, email) VALUES ($1, $2, $3) RETURNING labid;`
        let labInsert = [labName, labDesc, labEmail]

        db.query(sqlLab, labInsert, (err, dbResLab) => {
            if (err) {
                console.log(err);
            } else {
                let labid = dbResLab.rows[0].labid
                console.log(dbResLab.rows[0])
                console.log(`Lab Id = ${labid}`)

                
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(piPass, salt, (err, digestedPass) => {
        
                        const sqlUser = `INSERT INTO users (labid, name, role, email, digpassword, photo, accesslevel) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING userid;`
        
                        let userInsert = [labid, piName, 'PI', piEmail, digestedPass, piImage, 1]
        
                        db.query(sqlUser, userInsert, (err, dbResUser) => {
                            console.log(dbResUser)
                            console.log(dbResUser.rows[0])

                            let userid = dbResUser.rows[0].userid

                            console.log(`User Id = ${userid}`)

                            let data = {
                                userData: [{
                                    name:piName,
                                    photo:piImage,
                                    userid:userid,
                                    role:'PI',
                                    email:piEmail
                                }],
                                labData: {
                                    email:labEmail,
                                    description:labDesc,
                                    name:labName
                                }
                            }
                            res.render(`lab_page`, {data})
                        })
                    })
                }) 
            }
        })        
    }
})

router.delete(`/`, (req, res) => {
    const labid = req.body.labid
    console.log(labid);

    const sqlLab = `DELETE FROM laboratories WHERE labid = ${labid};`
    db.query(sqlLab, (err, dbRes) => {
        if (err) {
            console.log(err);
        } 
        // else {
        //     res.redirect(`/`)
        // }
    })
    const sqlUser = `DELETE FROM users WHERE labid = ${labid};`
    db.query(sqlUser, (err, dbRes2) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect(`/`)
        }
    })
})



router.get(`/:labid`, (req,res) => {
    const labid = req.params.labid
    const sql = `SELECT * FROM laboratories WHERE labid = $1;`

    let data = {}

    db.query(sql, [labid], (err, dbRes) => {
        if (err) {
            console.log(err);
        }
        data.labData = dbRes.rows[0]
        const sql2 = `SELECT * FROM users WHERE labid = $1 ORDER BY accesslevel ASC;`

        db.query(sql2, [labid], (err, dbRes2) => {
            if (err) {
                console.log(err);
            }
            data.userData = dbRes2.rows
            // res.send({data})
            res.render(`lab_page`, {data})
        })
    })
})


// Update user
router.post(`/edit/:userid`, (req, res) => {
    const labid = req.body.labid
    const labName = req.body.labName
    const desc = req.body.description
    const labEmail = req.body.labEmail


       

    const sqlLab = `UPDATE laboratories SET name = $1, description = $2, email = $3 WHERE labid = $4;`

    let labInsert = [labName, desc, labEmail, labid]

    db.query(sqlLab, labInsert, (err, dbResLab) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`UPDATE`);
            console.log(dbResLab)
            res.redirect(`/lab/${labid}`)
        }
    })
})







// Edit lab form
router.get(`/edit/:labid`, (req, res) => {
    const labid = req.params.labid
    const sqlLab = `SELECT * FROM laboratories WHERE labid = $1;`
    let data = {}


    db.query(sqlLab, [labid], (err, dbResLab) => {
        if (err) {
            // console.log(`Lab`);
            console.log(err);
        } else {
            data.labData = dbResLab.rows[0]
            res.render(`lab_update`, {data})
        }
    })
})





module.exports = router
