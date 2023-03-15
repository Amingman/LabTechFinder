const express = require(`express`)
const router = express.Router()
const bcrypt = require(`bcrypt`);


const db = require(`../db`)
db.connect()

router.get(`/`, (req, res) => {
    res.render(`user_search`)
})

router.get(`/user_search`, (req, res) => {
    const sql = `SELECT * FROM users;`

    db.query(sql, (err, dbRes) => {
        if (err) {
            console.log(err);
        }
        let data = {}
        data.title = 'Researchers'
        data.label = 'user'
        data.entries = dbRes.rows
        res.render(`search`, {data})
    })

})

router.post(`/user_search/byname`, (req, res) => {
    let name = req.body.name
    let names = name.split(` `)
    let stringName  = [] // The search terms as array
    names.forEach(name => {
        stringName.push(`%${name.toLowerCase()}%`)
    });

    // Dynamic string query sanitisation setup
    let sql = `SELECT * FROM users WHERE LOWER(name) LIKE `
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
        data.title = 'Researchers'
        data.label = 'user'
        data.entries = dbRes.rows
        res.render(`search`, {data})
    })
})



router.post(`/user_search/bylab`, (req, res) => {
    let name = req.body.lab
    let names = name.split(` `)
    let stringName  = []
    names.forEach(name => {
        stringName.push(`%${name.toLowerCase()}%`) 
    });

    // Dynamic string query sanitisation setup
    let sql = `SELECT labid FROM laboratories WHERE LOWER(name) LIKE`
    for (let i = 0; i < stringName.length; i++) {
        sql = `${sql} $${i+1}`
        if (i < stringName.length - 1) {
            sql = `${sql} OR LOWER(name) LIKE`
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
        sql = `SELECT * FROM users WHERE labid =`
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

            data.title = 'Researchers'
            data.label = 'user'
            data.entries = dbRes2.rows
            res.render(`search`, {data})
        })
    })

})

router.get(`/:userid`, (req,res) => {
    const userid = req.params.userid
    const sql = `SELECT * FROM users WHERE userid = $1;`

    let data = {}

    db.query(sql, [userid], (err, dbRes) => {
        if (err) {
            console.log(err);
        }
        data.userData = dbRes.rows[0]
        // res.render(`user_page`, {data})

        const sql2 = `SELECT * FROM laboratories WHERE labid = $1;`

        db.query(sql2, [data.userData.labid], (err, dbRes2) => {
            if (err) {
                console.log(err);
            }
            data.labData = dbRes2.rows[0]
            // res.send(data)
            // res.render(`user_page`, {data})
        })

        const sql3 = `SELECT skill FROM skills WHERE userid = $1;`

        db.query(sql3, [data.userData.userid], (err, dbRes3) => {
            if (err) {
                console.log(err);
            }
            data.skillData = dbRes3.rows
            // res.send(data)
            res.render(`user_page`, {data})
        })
    })
})

router.post(`/new`, (req, res) => {
    const labid = req.body.labid
    const labName = req.body.labName
    const labEmail = req.body.labEmail
    // res.send(`${labid} ${labName}`)
    let alert = ''
    res.render(`user_add`, {labid, labName, labEmail, alert})
})


router.post(`/`, (req, res) => {
    const labid = req.body.labid
    const labName = req.body.labName
    const labEmail = req.body.labEmail
    const userName = req.body.userName
    const fullRole = req.body.role.split(`,`)
    const role = fullRole[1]
    const userEmail = req.body.userEmail
    const tempPassword = req.body.tempPass
    const photo = req.body.userImage
    const accesslevel = fullRole[0]
    const confirm = req.body.confirm


    if (tempPassword != confirm) {
        res.render(`user_add`, {labid, labName, alert:`Password does not match.`})
    } else {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(tempPassword, salt, (err, digestedPass) => {

                const sqlUser = `INSERT INTO users (labid, name, role, email, digpassword, photo, accesslevel) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING userid;`

                let userInsert = [labid, userName, role, userEmail, digestedPass, photo, accesslevel]

                db.query(sqlUser, userInsert, (err, dbResUser) => {
                    // console.log(dbResUser)
                    // console.log(dbResUser.rows[0])

                    let userid = dbResUser.rows[0].userid

                    console.log(`User Id = ${userid}`)

                    let data = {
                        userData: [{
                            name:userName,
                            photo:photo,
                            userid:userid,
                            role:role,
                            email:userEmail
                        }],
                        labData: {
                            email:labEmail,
                            name:labName
                        }
                    }
                    res.render(`user_page`, {data})
                })
            })
        }) 
    }
})

router.delete(`/`, (req, res) => {
    const userid = req.body.userid
    console.log(userid);
    
    const sqlUser = `DELETE FROM users WHERE userid = $1;`
    db.query(sqlUser, [userid], (err, dbRes) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect(`/`)
        }
    })
})

// Edit user form
router.get(`/edit/:userid`, (req, res) => {
    const userid = req.params.userid
    const sqlUser = `SELECT * FROM users WHERE userid = $1;`
    let data = {}


    db.query(sqlUser, [userid], (err, dbResUser) => {
        if (err) {
            console.log(`User`);
            console.log(err);
        } else {
            data.userData = dbResUser.rows[0]
            const labid = dbResUser.rows[0].labid

            const sqlLab = `SELECT * FROM laboratories WHERE labid = $1;`
            db.query(sqlLab, [labid], (err, dbResLab) => {
              if (err) {
                console.log(`Lab`);
                console.log(err);
              } else {
                data.labData = dbResLab.rows[0]
              }
            })

            const sqlSkill = `SELECT skill FROM skills WHERE userid = $1;`
            db.query(sqlSkill, [userid], (err, dbResSkill) => {
                if (err) {
                    console.log(`Skill`);
                    console.log(err);
                } else {
                    data.skillData = dbResSkill.rows
                    // res.send({data})
                    res.render(`user_update`, {data, alert:''})
                }
            })
        }
    })
})


// Update user
router.patch(`/user/:userid`, (req, res) => {
    
})



module.exports = router
