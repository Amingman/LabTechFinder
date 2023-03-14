console.log(`Booting up server...`);

const express = require("express")
const expressLayouts = require('express-ejs-layouts')
const session = require(`express-session`)
const MemoryStore = require('memorystore')(session)


const app = express()
const port = process.env.PORT || 3000
const db = require(`./db`)

const middlewares = require(`./middlewares/middlewares_object`)

// const {Pool} = require(`pg`)
// const db = new Pool({
//     database: `labtechfinder`,
// })


app.set(`view engine`, `ejs`)

app.use(expressLayouts)
app.set("layout example", false);
// app.use(session({
//     secret: process.env.SESSION_SECRET || `keyboard cat`,
//     resave: false,
//     saveUninitialized: true
// }))





app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    secret: 'keyboard cat'
}))





app.use(middlewares.logger)
app.use(middlewares.static)
app.use(middlewares.urlEncoded)
app.use(middlewares.method_override)
app.use(middlewares.setCurrentUser)
app.use(middlewares.viewHelpers)
 


app.get(`/`, (req, res) => {
    res.render(`home`)
})












app.use(express.static("public"))

app.set(`view engine`, `ejs`)







// app.get([`/`, `/home`], (req, res) => {
//     const sql = `SELECT * FROM planets`

//     db.query(sql, (err, dbRes) => {
//         if (err) {
//             console.log(err);
//         } else {
//             // res.send(dbRes.rows)
//             res.render(`index`, {dbRes:dbRes.rows})
//         }
//     })
// })




app.listen(port, () => {
    console.log(`listening on port ${port}`);
})