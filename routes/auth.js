const router = require('express').Router();
const bcrypt = require('bcryptjs');
const connection = require('../database/dbService');
const { registerValidation, loginValidation } = require('./validation'); 
const jwt = require('jsonwebtoken');

router.post('/register', async(req, res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { name, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
                        
    try {
        const dateAdded = new Date();
        const user_role = 'user';
        const query = ('SELECT user_name FROM user WHERE user_name=?;');
        connection.query(query, [name], (err, result) => {
            if (err) {
                res.status(404).json({
                    message: 'Something went wrong in our End'
                })
            } else {
                if(result.length > 0) {
                    res.status(400).json({
                        message: 'Name already in use'
                    })
                } else {
                    // console.log('email not exist');
                    const query = "INSERT INTO user (user_name, user_password, role, created_at) VALUES (?, ?, ?, ?);";
                    connection.query(query, [name, hashedPassword, user_role, dateAdded], (err, result) => {
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
});


router.post('/login', async(req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { name, password } = req.body;

    const query = ('SELECT * FROM user WHERE user_name=?;');
    connection.query(query, [name], async(err, user) => {
            if (err) {
                res.status(404).json({
                    message: 'Something went wrong in our End'
                })
            } else {
                if(user.length > 0) {
                    const validPass =  await bcrypt.compare(password, user[0].user_password);
                    if(!validPass) return res.status(404).json({
                        message: 'invalid user name or password'
                    });
                    const token = jwt.sign({id: user[0].user_id, role: user[0].role}, process.env.TOKEN_SECRET);
                    res.header('auth-token', token).send(token);
                } else {
                    res.status(404).json({
                        message: 'invalid user name or password'
                    })
                }
                // console.log(user);
            }
        });

});

router.post('/getuser', async(req, res) => {
    const { name } = req.body;

    const query = ('SELECT * FROM user WHERE user_name=?;');
    connection.query(query, [name], (err, user) => {
        if (err) {
            res.status(404).json({
                message: 'Something went wrong in our End'
            })
        } else {
            res.status(200).json({
                data: user[0]
            })
        }
    })
})


module.exports = router;