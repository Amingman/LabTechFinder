console.log(`Booting up server...`);

const express = require("express")
const expressLayouts = require('express-ejs-layouts')
const session = require(`express-session`)
const MemoryStore = require('memorystore')(session)
const axios = require("axios");
// const options = {
//     method: 'GET',
//     url: 'https://ny-times-news-titles-and-urls.p.rapidapi.com/news',
//     headers: {
//       'X-RapidAPI-Key': '205e605d9bmsh0126ab975efa369p1e6b1cjsn4047847b6823',
//       'X-RapidAPI-Host': 'ny-times-news-titles-and-urls.p.rapidapi.com'
//     }
// };

const options = {
    method: 'GET',
    url: 'https://newsdata.io/api/1/news?apikey=pub_18880686ef76f718468c45fffd56a1c37e408&country=au&language=en&category=science',
    // params: {id: 'country-us', numberOfRow: '5', pageNumber: '1', sortBy: 'hot'},
    // headers: {
    //   'X-RapidAPI-Key': '205e605d9bmsh0126ab975efa369p1e6b1cjsn4047847b6823',
    //   'X-RapidAPI-Host': 'hot-breaking-news-latest-news.p.rapidapi.com'
    // }
  };



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
    secret: process.env.SESSION_SECRET || 'keyboard cat'
}))





app.use(middlewares.logger)
app.use(middlewares.static)
app.use(middlewares.urlEncoded)
app.use(middlewares.method_override)
app.use(middlewares.setCurrentUser)
app.use(middlewares.viewHelpers)
 




// let acceptedSource = [`technews`, `nasa`, `sciencealert`, `theguardian`]
// let top5News = []
// axios.request(options).then(function (response) {
//     let counter = 0
//     for (i = 0; counter < 5; i++) {
//         news = response.data.results[i]
//         if (acceptedSource.includes(news.source_id)) {
//             top5News.push(news)
//             console.log(`got one`);
//             counter++
//         }
//         if (i == response.data.results.length - 1) {
//             break
//         }
//     }
//     console.log(top5News);
// }).catch(function (error) {
// 	console.error(error);
// });





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