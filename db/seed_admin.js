const bcrypt = require(`bcrypt`);
const {Pool} = require (`pg`)
const db = new Pool({
    database: `labtechfinder`
})

db.connect()

const data = [
    {
        lab: 0,
        name: `Admin Sudo`,
        role: `PI`,
        email: `adminsudo@sciency.com`,
        pass: `banana`,
        photo: `https://static.wikia.nocookie.net/lotr/images/8/8d/Gandalf-2.jpg/revision/latest?cb=20130209172436`,
        accesslevel: 0,
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

