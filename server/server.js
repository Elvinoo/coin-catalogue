const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();
app.use(cors());
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
})

//X-API-Key verifikasiyasi 
const x_api_key = process.env.X_API_KEY;
connection.connect((err) => {
    if (!err) {
        console.log('Connected to database!')
    } else {
        console.log(err)
    }
});
const apiKeyVerificationMiddleware = (req, res, next) => {
    const apiKey = req.headers['api-key'];
    if (apiKey !== x_api_key) {
        return res.status(401).send('Unauthorized');
    }
    next();
};
app.use(apiKeyVerificationMiddleware);


//shekillerin serverde gorunmesi
app.use('/images', express.static('imgs'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//userin geydiyyatdan kecmesi
app.post("/admin-panel/register", (req, res) => {
    const { userName, password } = req.body;
    const salt = bcrypt.genSaltSync(15);
    const hash = bcrypt.hashSync(password, salt);
    const user = {
        userName: userName.toLowerCase(),
        password: hash
    }
    // burada userin serverde olub olmamasini ilkin olaraq yoxlayirig
    connection.query("SELECT * FROM user_login WHERE userName=?", [userName], (err, data) => {
        if (err) {
            return res.status(400).send(err)
        } else {
            if (data.length > 0) {
                res.send('The Username is taken. Try another')
            } else {// eger yoxdursa o zaman qeydiyyatdan kecirilir
                connection.query("INSERT INTO user_login SET ?", user, (err, data) => {
                    if (err) return res.status(500).send({ error: "Internal Server Error" })
                    res.send("User sucessfully registered")
                })
            }
        }
    })
});

//login olmasi
app.post("/login", (req, res) => {
    const { userName, password } = req.body;
    //ilk olarag userName-in databazada olmasini yoxlayirig
    connection.query("SELECT * FROM user_login WHERE userName=?", [userName], (err, data) => {
        if (err) {
            return res.status(500).json({ error: "An error occurred while checking the user credentials." });
        }
        if (data.length === 0) {
            res.status(401).json({ error: "Invalid Username" })
        } else {//eger varsa ondan sonra parolu yoxlayirig ve dogru paroldursa jwt token yaradib fronta gonderirik
            const hashedPassword = data[0].password;
            const verification = bcrypt.compareSync(password, hashedPassword)
            if (verification) {
                const user = data[0]
                const token = jwt.sign({ userID: user.id }, process.env.JWT_SECRET_KEY, {
                    expiresIn: "1h"
                });
                res.status(200).json({ loggedIn: true, token })
            } else {
                res.send({ error: "Invalid password. Please try again" })
            }

        }
    })

})
//Homepage girish ucun atilan requestde her categoriyadan bir coin gosteririk
app.get("/", (req, res) => {
    connection.query(`SELECT 
    category,
    max(id) as id,
    max(coinName) as coinName,
    max(observeLink) as observeLink
    
 FROM
    coins 
 GROUP BY 
    category;`, (err, data) => {
        if (!err) return res.json(data);
        res.status(500).send();
    })
});

//homepagede kateqoriyanin onunde show all-a clicklenerse hemin categoriyaya uygun coinlerin alinmasi ucun query
app.get('/coins/:category', (req, res) => {
    const { category } = req.params;
    connection.query(`Select * from coins WHERE category LIKE '%${category}%';`, (err, data) => {
        if (!err) return res.json(data);
        res.status(404).send()
    })
});

// eger her hansi coinin id-e gore sorgu atilarsa hemin coinin gonderilmesi ucun query
app.get('/coin/:id', (req, res) => {
    const { id } = req.params;
    connection.query(`SELECT * FROM coins WHERE id=${id};`, (err, data) => {
        if (!err) return res.json(data);
        res.status(404).send()
    })
});


//axtarish ucun sorgu. eger sorguda yalniz esas searhc inputdan deyer gelirse o q= sheklinde gelir
app.get('/search', (req, res) => {
    const { q, ...rest } = req.query;
    //eger advanced search secilibse parametrlere uygun cavab gelir
    let query = `SELECT * FROM coins WHERE isRemoved=0 AND price BETWEEN ${rest.priceFrom} AND ${rest.priceTo} AND year BETWEEN ${rest.yearFrom} AND ${rest.yearTo}`

    //eger ashagidaki deyerler secilibse onlar da query-e elave edilsin
    rest.category ? query += ` AND category="${rest.category}"` : null;
    rest.country ? query += ` AND country="${rest.country}"` : null;
    rest.metal ? query += ` AND metal="${rest.metal}"` : null;
    query += ';';
    if (Object.keys(rest).length === 0) {
        // eger q-dan bashgasi gelmezse o zaman adi searchin cavabi gelsin
        connection.query(`SELECT * FROM coins WHERE (coinName LIKE '%${q}%') OR (longDesc LIKE '%${q}%') AND isRemoved=0 ;`, (err, data) => {
            if (err) return res.status(500).send({ found: 0 })
            res.json(data)
        })
    } else {
        connection.query(query, (err, data) => {
            if (err) return res.status(500).send({ found: 0 })
            res.json(data)
        })
    }
});

//burada biz advanced filterdeki selectlere konkret option vermek ucun sorgu atirig.
//Meqsed advanced filterdeki searchlerin optionlari yalnizca data bazaya elave olunan coinlerin olkelerim, kategoriyalari
//ve metal secimini elave edirik. Sebeb ise elave ederken  kategoriya, olke ve metal input olaraq gosteririk. Bundan elave
// bezi coinlerin istehsal olundugu olkelerin adlari bugunku olke adlarindan ferglenir. Meselen The Belgian Congo.
//
app.get('/countryList', (req, res) => {
    connection.query('SELECT DISTINCT country FROM coins WHERE isRemoved=0 order by country;', (err, countryOptions) => {
        if (err) return res.status(500).send({ error: "Couldn't connect to Database" })
        connection.query('SELECT DISTINCT category FROM coins WHERE isRemoved=0 order by category;', (err, categoryOptions) => {
            if (err) return res.status(500).send({ error: "Couldn't connect to Database" })
            connection.query('SELECT DISTINCT metal FROM coins WHERE isRemoved=0 order by metal;', (err, metalOptions) => {
                if (err) return res.status(500).send({ error: "Couldn't connect to Database" })
                res.send({
                    countryOptions: countryOptions,
                    categoryOptions: categoryOptions,
                    metalOptions: metalOptions,
                })

            })
        })

    })
});

// Admin panelde edit hisseye gedende en son elave olunan coinleri almag ucun yazilan query
app.get("/admin-panel/editCoin", (req, res) => {
    connection.query(`SELECT * FROM coins WHERE isRemoved=0 ORDER BY id DESC;`, (err, data) => {
        if (err) return res.status(500).send({ error: "Couldn't connect to Database" })
        res.json(data)
    })
});

// coinlerin elave olunmasi ucun sorgu
app.post('/addCoin', (req, res) => {
    let newData = req.body;
    for (const key in req.body) {
        if (!req.body[key]) {
            return res.send({ error: 'Value is null', errorcode: 999 });
        }
    }
    connection.query(`INSERT INTO coins SET ?;`, newData, (err, data) => {
        if (err) {
            res.send({ err, errorcode: 999 })
        } else {
            res.send({ successfull: true })
        }
    })
});

// coinlerin id-e uygun deyishdirilmesi ucun sorgu
app.put('/editCoin/:id', (req, res) => {
    const { id } = req.params;
    let updatedData = req.body;
    let query = 'UPDATE coins SET ? WHERE id=?'
    connection.query(query, [updatedData, id], (err, data) => {
        if (err) {
            res.send({ err })
        } else {
            res.send({ successfull: true })
        }
    })
});




app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    connection.query("UPDATE coins SET isRemoved=true WHERE id=? ", [id], (err, data) => {
        if (err) return res.status(500).send(err);
        res.send({ isRemoved: true })
    })
})



app.listen(5000, () => console.log("Joined to the server on port 5000!"));