const router = require('express').Router();
const bcrypt = require('bcryptjs');
const url = require('url');

const connection = require('../database/dbService');
const { 
    registerValidation, 
    loginValidation,
    authRole 
} = require('./validation'); 

const jwt = require('jsonwebtoken');

router.post('/register', async(req, res) => {
    const { error } = registerValidation(req.body);
    if (error) {
        console.log("ERROR: " + error.message);
        return res.status(400).json({
            message: error.details[0].message
        })
    }
    const { name, password, contact } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
           
    const dateAdded = new Date();
    const user_role = 'user';
    const query = ('SELECT user_name FROM Users WHERE user_name=?;');
    connection.query(query, [name], (err, result) => {
        if (err) {
            console.log(err.message);
            res.status(404).json({
                message: 'Something went wrong in our End'
            })
        } else {
            if(result.length > 0) {
                res.status(400).json({
                    message: 'Name already in use'
                })
            } else {
                if(result.length > 0) {
                    res.status(400).json({
                        message: 'Name already in use'
                    })
                } else {
                    const query = "INSERT INTO Users (user_name, user_password, contact, role, created_at) VALUES (?, ?, ?, ?, ?);";
                    connection.query(query, [name, hashedPassword, contact, user_role, dateAdded], (err, result) => {
                        if (err) {
                            console.log(err.message);
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
        }
    });
    
});


router.post('/login', async(req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { name, password } = req.body;

    const query = ('SELECT * FROM Users WHERE user_name=?;');
    connection.query(query, [name], async(err, user) => {
            if (err) {
                console.log("ERROR: " + err.message);
                res.status(404).json({
                    message: 'Something went wrong in our End'
                })
            } else {
                if(user.length > 0) {
                    const validPass =  await bcrypt.compare(password, user[0].user_password);
                    if(!validPass) return res.status(404).json({
                        message: 'invalid user name or password',
                        auth: false
                    });
                    const signed_token = jwt.sign({id: user[0].user_id, role: user[0].role, auth: true}, process.env.TOKEN_SECRET);
                    res.status(200).json({
                        token: signed_token,
                        auth: true,
                        role: user[0].role,
                        user_log_id: user[0].user_id
                    })
                } else {
                    res.status(404).json({
                        message: 'invalid user name or password',
                        auth: false
                    })
                }
            }
        });

});

router.get('/getuserbyid/:id', authRole('admin'), async(req, res) => {
    const id = req.params.id;
    const query = ("SELECT * FROM Users WHERE user_id=?;");
    connection.query(query, [id], (err, user) => {
        if (err) {
            console.log("ERROR: " + err.message);
            res.status(404).json({
                message: 'Something went wrong in our End'
            })
        } else {
            res.status(200).json({
                data: user[0]
            })
        }
    });
});

router.get('/getallusers', authRole('admin'), async(req, res) => {
    const query = ("SELECT * FROM Users WHERE role='user';");
    connection.query(query, (err, users) => {
        if (err) {
            console.log("ERROR: " + err.message);
            res.status(404).json({
                message: 'Something went wrong in our End',
                err_message: err.message
            })
        } else {
            if (users.length == 0) {
                res.status(500).json({
                    message: 'No user exist in databases',
                })
            } else {
                res.status(200).json({
                    data: users
                })
            }
        }
    });
});

router.delete('/deleteuserbyid/:id', authRole('admin'), async(req, res) => {
    const id = req.params.id;
    const query = ("DELETE FROM Users where user_id=? AND role='user';");
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.log("ERROR: " + err.message);
            res.status(500).json({
                message: err.message,
            })
        } else {
            if (result.affectedRows == 0) {
                return res.status(500).json({
                    message: 'unable to delete this user'
                })
            }
            res.status(200).json({
                message: 'delete user successful'
            })
        }
    });
});

router.put('/updateinfo/:id', authRole('admin'), async(req, res) => {
    const id = req.params.id;
    const { name, password, contact } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const a_query = ("SELECT * FROM Users WHERE user_name=?;");
    connection.query(a_query, [name], (err, result) => {
        if (err) {
            console.log("ERROR: " + err.message);
            res.status(500).json({
                message: err.message,
            });
        } else {
            if (result.length > 0) {
                return res.status(409).json({
                    message: 'duplicate user name',
                });
            } else {
                const query = ("UPDATE Users SET user_name=?, user_password=?, contact=? WHERE user_id=?;");
                connection.query(query, [name, hashedPassword, contact, id], (err, result) => {
                    if (err) {
                        console.log("ERROR: " + err.message);
                        res.status(500).json({
                            message: err.message,
                        });
                    } else {
                        if (result.affectedRows == 0) {
                            return res.status(500).json({
                                message: 'unable to update user'
                            })
                        }
                        res.status(200).json({
                            message: 'update user successful'
                        });
                    }
                });
            }
        }
    });

    
});





module.exports = router;