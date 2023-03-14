const bcrypt = require(`bcrypt`);
const {Pool} = require (`pg`)
const db = new Pool({
    database: `labtechfinder`
})

db.connect()

const data = [
    {
        lab: 2,
        name: `Imelda Bell`,
        role: `PI`,
        email: `imeldabell@sciency.com`,
        pass: `imeldabell`,
        photo: `../images/doesnotexist/female3.jpeg`,
        accesslevel: 1,
    },{
        lab: 2,
        name: `Coby Prescott`,
        role: `Manager`,
        email: `cobyprescott@sciency.com`,
        pass: `cobyprescott`,
        photo: `../images/doesnotexist/female2.png`,
        accesslevel: 2,
    },{
        lab: 2,
        name: `Zac Simmon`,
        role: `Animal Model Technician`,
        email: `zacsimmon@sciency.com`,
        pass: `zacsimmon`,
        photo: `../images/doesnotexist/male2.webp`,
        accesslevel: 3,
    },{
        lab: 2,
        name: `Louise Albescu`,
        role: `Research Officer`,
        email: `lousiealbescu@sciency.com`,
        pass: `lousiealbescu`,
        photo: `../images/doesnotexist/female5.png`,
        accesslevel: 3,
    },{
        lab: 3,
        name: `David King`,
        role: `PI`,
        email: `davidking@sciency.com`,
        pass: `davidking`,
        photo: `../images/doesnotexist/male1.png`,
        accesslevel: 1,
    },{
        lab: 3,
        name: `Ana Rossini`,
        role: `Manager`,
        email: `anarossini@sciency.com`,
        pass: `annarossini`,
        photo: `../images/doesnotexist/female1.webp`,
        accesslevel: 2,
    },{
        lab: 3,
        name: `Brennan Sobol`,
        role: `Biostatistician`,
        email: `brennansobol@sciency.com`,
        pass: `brennansobol`,
        photo: `../images/doesnotexist/male3.webp`,
        accesslevel: 3,
    },{
        lab: 3,
        name: `Bellamy Radu`,
        role: `Postdoc Fellow`,
        email: `bellamyradu@sciency.com`,
        pass: `bellamyradu`,
        photo: `../images/doesnotexist/male5.webp`,
        accesslevel: 3,
    },{
        lab: 3,
        name: `Alexandra Vicario`,
        role: `Lab Tech`,
        email: `alexandravicario@sciency.com`,
        pass: `alexandravicario`,
        photo: `../images/doesnotexist/female4.jpeg`,
        accesslevel: 3,
    },{
        lab: 3,
        name: `Malcolm Wang`,
        role: `Lab Tech`,
        email: `malcolmwang@sciency.com`,
        pass: `malcolmwang`,
        photo: `../images/doesnotexist/male4.webp`,
        accesslevel: 3,
    }
]

data.forEach(insert => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(insert.pass, salt, (err, digestedPass) => {
    
            const sql = `INSERT INTO users (labid, name, role, email, digpassword, photo, accesslevel) VALUES ($1, $2, $3, $4, $5, $6, $7);`
            // const insert = data[0] 
            const sqlInsert = [insert.lab, insert.name, insert.role, insert.email, digestedPass, insert.photo, insert.accesslevel]
            // digestedPass is what we save in db
            console.log(digestedPass);
    
            db.query(sql, sqlInsert, (err, dbRes) => {
                console.log(err);
                // db.end()
            })
    
        })
    }) 
});

