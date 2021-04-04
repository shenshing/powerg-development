const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();


// const connection = mysql.createConnection({
//     host: process.env.HOST,
//     user: process.env.USERNAME,
//     password: process.env.PASSWORD,
//     database: process.env.DATABASE,
//     port: process.env.DB_PORT
// });

// connection.connect((err) => {
//     if (err) {
//         console.log(err.message);
//     }
//     console.log('connected to database');
// });

const connection = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

connection.getConnection((err, conn) => {
    if (err) {
        console.log('ERROR: ' + err.message);
    } else {
        const query = ('SELECT * FROM Users;');
        conn.query(query, (err, result) => {
            if(err) {
                console.log('ERROR: ' + err.message)
            } else {
                // console.log(result);
                console.log('connected to database on digitalocean')
                // console.log(conn);
            }
        })
    }
    // console.log('connected to database');
});

module.exports = connection;