console.log(`Booting up server...`);

const express = require("express")
const expressLayouts = require('express-ejs-layouts')
const session = require(`express-session`)
const MemoryStore = require('memorystore')(session)
const middlewares = require(`./middlewares/middlewares_object`)
const axios = require("axios");


// Controllers
const sessionController = require(`./controllers/session_controller`)
const labController = require(`./controllers/lab_controller`)
const userController = require(`./controllers/user_controller`)
const socialController = require(`./controllers/social_controller`)



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
 


app.use(`/session`, sessionController) // router for sessions




app.get([`/`, `/home`], (req, res) => {

    // News API
    // let acceptedSource = [`technews`, `nasa`, `sciencealert`, `theguardian`, `gizmodo`, `phys`]
    let acceptedSource = [`technews`, `nasa`, `theguardian`, `gizmodo`, `phys`]
    // let acceptedSource = [`technews`, `nasa`, `theguardian`, `gizmodo`]
    let top5News = []
    let url = 'https://newsdata.io/api/1/news?apikey=pub_18880686ef76f718468c45fffd56a1c37e408&country=au&language=en&category=science&page'
    
    // axios.request(url).then(function (response) {
    //     let counter = 0
    //     for (i = 0; counter < 5; i++) {
    //         news = response.data.results[i]
    //         if (acceptedSource.includes(news.source_id)) {
    //             top5News.push(news)
    //             // console.log(`got one`);
    //             counter++
    //         }
    //         // console.log(news.source_id);
    //         if (i == response.data.results.length - 1) {
    //             break
    //         }
    //     }
        res.render(`home`, {top5News, session: req.session})
    // }).catch(function (error) {
    //     console.error(error);
    // });
})


app.use(`/lab`, labController) // router for laboratories
app.use(`/user`, userController) // router for users
app.use(`/social`, socialController) // router for users

app.get(`/links`, (req, res) => {
    res.render(`links`, {session: req.session})
})

app.get(`/about`, (req, res) => {
    res.render(`about`, {session: req.session})
})







app.listen(port, () => {
    console.log(`listening on port ${port}`);
})