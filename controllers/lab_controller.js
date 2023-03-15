const express = require(`express`)
// const router = express.Router()
const router = express.Router()

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
    res.render(`lab_add`)
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







module.exports = router
