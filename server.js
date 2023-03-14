console.log(`Booting up server...`);

const express = require("express")
const expressLayouts = require('express-ejs-layouts')
const session = require(`express-session`)
const MemoryStore = require('memorystore')(session)
const middlewares = require(`./middlewares/middlewares_object`)
const axios = require("axios");

// News API
const options = {
    method: 'GET',
    url: 'https://newsdata.io/api/1/news?apikey=pub_18880686ef76f718468c45fffd56a1c37e408&country=au&language=en&category=science',
    // params: {id: 'country-us', numberOfRow: '5', pageNumber: '1', sortBy: 'hot'},
    // headers: {
    //   'X-RapidAPI-Key': '205e605d9bmsh0126ab975efa369p1e6b1cjsn4047847b6823',
    //   'X-RapidAPI-Host': 'hot-breaking-news-latest-news.p.rapidapi.com'
    // }
  };

// // Controllers
// const labController = require(`./controllers/lab_controller`)
// console.log(labController);



const app = express()
const port = process.env.PORT || 3000

app.set(`view engine`, `ejs`)

// Layouts. Layout is in /views/layout.ejs
app.use(expressLayouts)
app.set("layout example", false);

app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    secret: process.env.SESSION_SECRET || 'keyboard cat'
}))



app.use(middlewares.logger)
app.use(middlewares.static)
app.use(middlewares.urlEncoded)
app.use(middlewares.method_override)
app.use(middlewares.setCurrentUser)
app.use(middlewares.viewHelpers)
 







app.get([`/`, `/home`], (req, res) => {
    let acceptedSource = [`technews`, `nasa`, `sciencealert`, `theguardian`]
    let top5News = []
    axios.request(options).then(function (response) {
        let counter = 0
        for (i = 0; counter < 5; i++) {
            news = response.data.results[i]
            if (acceptedSource.includes(news.source_id)) {
                top5News.push(news)
                console.log(`got one`);
                counter++
            }
            if (i == response.data.results.length - 1) {
                break
            }
        }
        res.render(`home`, {top5News})
    }).catch(function (error) {
        console.error(error);
    });

})

// app.use(`/lab`, labController) // router for laboratories


const db = require(`./db`)
db.connect()


app.get(`/lab`, (req, res) => {
// router.get(`/`, (req, res) => {
    // const sql = `SELECT * FROM laboratories WHERE labid > 1;`
    // db.query(sql, (err, dbRes) => {
    //     let data = {}
    //     data.title = 'Laboratories'
    //     data.label = 'lab'
    //     data.entries = dbRes.rows
    res.render(`lab_search`)
    // })
})

app.get(`/lab/lab_search`, (req, res) => {
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

app.post(`/lab/lab_search/byname`, (req, res) => {
    let name = req.body.name
    let names = name.split(` `)
    let stringName  = []
    names.forEach(name => {
        // stringName.push(`%${name.toLowerCase()}%`)
        stringName.push(`'%${name.toLowerCase()}%'`) //sql2
    });
    stringName = stringName.join(` OR LOWER(name) LIKE `)
    
    const sql = `SELECT * FROM laboratories WHERE LOWER(name) LIKE $1;`
    const sql2 = `SELECT * FROM laboratories WHERE LOWER(name) LIKE ${stringName};`


    console.log(sql2);
    // db.query(sql, [stringName], (err, dbRes) => {
    db.query(sql2, (err, dbRes) => {
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


app.post(`/lab/lab_search/bypi`, (req, res) => {
    let name = req.body.pi
    let names = name.split(` `)
    let stringName  = []
    names.forEach(name => {
        // stringName.push(`%${name.toLowerCase()}%`) 
        stringName.push(`'%${name.toLowerCase()}%'`) //sql2
    });
    stringName = stringName.join(` AND role ='PI' OR LOWER(name) LIKE `)
    
    let sql = `SELECT labid FROM users WHERE LOWER(name) LIKE $1 AND role ='PI';`
    let sql2 = `SELECT labid FROM users WHERE LOWER(name) LIKE ${stringName} AND role ='PI';`

    console.log(`here`);
    // console.log(sql2);
    // db.query(sql, [stringName], (err, dbRes) => {
    db.query(sql2, (err, dbRes) => {
        if (err) {
            console.log(err);
        }
        // console.log(dbRes);
        let ids = dbRes.rows
        let stringId = []
        ids.forEach(id => {
            stringId.push(id.labid)
        })
        // console.log(stringId);
        stringId = stringId.join(` OR labid = `)

        console.log(stringId);
        sql = `SELECT * FROM laboratories WHERE labid = $1`
        sql2 = `SELECT * FROM laboratories WHERE labid = ${stringId}`
        // db.query(sql, [stringId], (err, dbRes2) => {
        db.query(sql2, (err, dbRes2) => {
            if (err) {
                console.log(err);
            }
            let data = {}

            data.title = 'Laboratories'
            data.label = 'lab'
            data.entries = dbRes2.rows
            // console.log(`here`);
            // console.log(data.entries);
            res.render(`search`, {data})
        })

        // let data = {}

        // data.title = 'Laboratories'
        // data.label = 'lab'
        // data.entries = dbRes.rows
        // // console.log(`here`);
        // // console.log(data.entries);
        // res.render(`search`, {data})
    })

})


app.get(`/lab/:labid`, (req,res) => {
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


















app.listen(port, () => {
    console.log(`listening on port ${port}`);
})