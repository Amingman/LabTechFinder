const express = require(`express`)
const router = express.Router()

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
        res.render(`user_page]`, {data})
    })
})



module.exports = router
