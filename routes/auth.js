const router = require('express').Router();
const mysql = require('mysql2');
const connection = require('../database/dbService');


router.post('/register', async(req, res) => {
    const { name, email, password } = req.body;
    try {
        const dateAdded = new Date();
            const query = ('SELECT email FROM user WHERE email=?;');
            connection.query(query, [email], (err, result) => {
                if (err) {
                    res.status(404).json({
                        message: 'Something went wrong in our End'
                    })
                } else {
                    if(result.length > 0) {
                        res.status(400).json({
                            message: 'Email already exist'
                        })
                    } else {
                        console.log('email not exist');
                        const query = "INSERT INTO user (name, email, password, date) VALUES (?, ?, ?, ?);";
                        connection.query(query, [name, email, password, dateAdded], (err, result) => {
                            if (err) {
                                res.status(404).json({
                                    message: 'Something went wrong in our End'
                                })
                            } else {
                                res.status(200).json({
                                    message: "Successful Register"
                                })
                            }
                        })
                    }
                }
            });
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;