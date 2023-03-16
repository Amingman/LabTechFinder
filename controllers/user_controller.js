const express = require(`express`)
const router = express.Router()
const bcrypt = require(`bcrypt`);


const db = require(`../db`)
db.connect()

router.get(`/`, (req, res) => {
    res.render(`user_search`, {session: req.session})
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
        res.render(`search`, {data, session: req.session})
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
        res.render(`search`, {data, session: req.session})
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
            res.render(`search`, {data, session: req.session})
        })
    })

})



router.post(`/user_search/byskill`, (req, res) => {
    let skill = req.body.skill
    let skills = skill.split(` `)
    let stringSkill  = [] // The search terms as array
    skills.forEach(skill => {
        stringSkill.push(`%${skill.toLowerCase()}%`)
    });

    // Dynamic string query sanitisation setup
    let sql = `SELECT DISTINCT userid FROM skills WHERE LOWER(skill) LIKE `
    for (let i = 0; i < stringSkill.length; i++) {
        sql = `${sql} $${i+1}`
        if (i < stringSkill.length - 1) {
            sql = `${sql} OR LOWER(skill) LIKE `
        }
    }    
    sql = `${sql};`

    db.query(sql, stringSkill, (err, dbRes) => {
        if (err) {
            console.log(err);
        }
        let data = {}
        users = [] 
        constructor = []
        // dbRes.rows.forEach(userid => {users.splice(1, 0, userid.userid)})
        dbRes.rows.forEach((userid, index) => {
            users.push(userid.userid)
            constructor.push(`$${index+1}`)
        })
        constructor = constructor.join(`, `)
        constructor = `(${constructor})`
        // res.send(users)

        let sqlUser = `SELECT * FROM users WHERE userid IN ${constructor};`
        // let sqlUser = `SELECT * FROM users WHERE userid IN ${users};`
        db.query(sqlUser, users, (err, dbResUser) => {
        // db.query(sqlUser, (err, dbResUser) => {
            if (err) {
                console.log(err);
            } else {
                let data = {}
                
                data.title = 'Researchers'
                data.label = 'user'
                data.entries = dbResUser.rows
                res.render(`search`, {data, session: req.session})
            }
        })


        // res.render(`search`, {data, session: req.session})
    })
})



router.get(`/new`, (req, res) => {
    const labid = req.query.labid
    // console.log(`Lab ID @ /new`);
    // console.log(labid);
    const labName = req.query.labName
    const labEmail = req.query.labEmail
    // res.send(`${labid} ${labName}`)
    let alert = ''
    res.render(`user_add`, {labid, labName, labEmail, alert, session: req.session})
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
            res.render(`user_page`, {data, session: req.session})
        })
    })
})







router.post(`/`, (req, res) => {
    const labid = req.body.labid
    // console.log(`labid @ /`);
    // console.log(labid);
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
        res.render(`user_add`, {labid, labName, alert:`Password does not match.`, session: req.session})
    } else {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(tempPassword, salt, (err, digestedPass) => {

                const sqlUser = `INSERT INTO users (labid, name, role, email, digpassword, photo, accesslevel) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING userid;`

                let userInsert = [labid, userName, role, userEmail, digestedPass, photo, accesslevel]

                console.log(userInsert);

                db.query(sqlUser, userInsert, (err, dbResUser) => {
                    if (err) {
                        console.log(err);
                    } else {
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
                        // res.render(`user_page`, {data})
                        res.redirect(`/lab/${labid}`)
                    }

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

// Update user
router.put(`/edit/:userid`, (req, res) => {
    const labid = req.body.labid
    const userid = req.body.userid
    const userName = req.body.userName
    const userEmail = req.body.userEmail
    const fullRole = req.body.role.split(`,`)
    const accesslevel = fullRole[0]
    const role = fullRole[1]
    const photo = req.body.userImage
    const password = req.body.pass
    const confirm = req.body.confirm
    const skills = req.body.skill.split(`,`).slice(0,-1)



    if (password != confirm) {
        res.render(`user_add`, {labid, labName, alert:`Password does not match.`, session: req.session})
    } else {

        const sqlDrop = `DELETE FROM skills WHERE userid = $1`
        db.query(sqlDrop, [userid], (err, dbResDrop) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`DELETE`);
                console.log(dbResDrop);

                skills.forEach(skill => {
                    const sqlSkill = `INSERT INTO skills (labid, userid, skill) VALUES ($1, $2, $3)`
                    
                    db.query(sqlSkill, [labid, userid, skill], (err, dbResSkill) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(`SKILLS`);
                            console.log(dbResSkill);
                        }
                    })
                });
            }                
        })

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, digestedPass) => {

                const sqlUser = `UPDATE users SET name = $1, role = $2, email = $3, digpassword = $4, photo = $5, accesslevel = $6 WHERE userid = $7;`

                let userInsert = [userName, role, userEmail, digestedPass, photo, accesslevel, userid]

                db.query(sqlUser, userInsert, (err, dbResUser) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`UPDATE`);
                        console.log(dbResUser)
                        // res.redirect(`/`)
                        req.session.destroy(() => {
                            res.redirect(`/`)
                        })
                    }
                })
            })
        })
    }
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
                    res.render(`user_update`, {data, alert:'', session: req.session})
                }
            })
        }
    })
})






module.exports = router
