const e = require('express');
const connection = require('../database/dbService');
const { route } = require('./package');
const router = require('express').Router();

router.post('/addList', async(req, res) => {
    const date = new Date();
    const dateAdded = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
    const { package, deliveryManId, listId } = req.body;
    const total = 0.00;

    try {
        const query = "SELECT * FROM PackageList WHERE listId = ?;";
        connection.query(query, [listId], (err, result) => {
            if(err) {
                console.log('ERROR: ' + err.message);
                res.status(500).json({
                    message: err.message,
                });
            } else {
                if(result.length === 0) {
                    const query = "INSERT INTO PackageList(listId, packages, total, deliveryManId, created_at) VALUES(?, ?, ?, ?, ?);";
                    connection.query(query, [listId, package, total, deliveryManId, dateAdded], (err, result) => {
                        if(err) {
                            console.log(err);
                            res.status(404).json({
                                message: 'Something went wrong in our End'
                            })
                        } else {
                            res.status(200).json({
                                message: 'list created successful',
                            })
                        }
                    })
                } else {
                    const query = "SELECT packages FROM PackageList WHERE listId = ?;";
                    connection.query(query, listId, (err, result) => {
                        if(err) {
                            console.log(err);
                            res.status(404).json({
                                message: 'Something went wrong in our End'
                            })
                        } else {
                            let existPackage = result[0].packages;
                            existPackage = existPackage + ',' + package;
                            const query = "UPDATE PackageList SET packages = ? WHERE listId  = ? AND deliveryManId = ?;";
                            connection.query(query, [existPackage, listId, deliveryManId], (err, result) => {
                                if(err) {
                                    console.log(err);
                                    res.status(404).json({
                                        message: err.message
                                    })
                                } else {
                                    if(result.affectedRows === 0) {
                                        res.status(404).json({
                                            message: 'Something went wrong in our End'
                                        })
                                    } else {
                                        res.status(200).json({
                                            message: 'package added'
                                        })
                                    }
                                }
                            })
                        }
                    })
                }
            }
            

        })
    } catch (error) {
        res.status(404).json({
            message: error.message
        })
    } 
})

// router.get('/getListById/:listId/:user', async(req, res) => {
//     const id = parseInt(req.params.listId);
//     const delivery_man_id = parseInt(req.params.user);
       
    
//     const query = "SELECT * FROM PackageList WHERE listId = ? AND deliveryManId = ?;";
//     connection.query(query, [id, delivery_man_id], (err, result) => {
//         if(err) {
//             console.log(err);
//             res.status(404).json({
//                 message: 'Something went wrong in our End'
//             })
//         } else {
//             for(let i=0; i<packageListId.length; i++) {
//                 const query = "SELECT * FROM package WHERE package_id = ?;";
//                 connection.query(query, packageListId[i], (err, result) => {
//                     if(err) {
//                         console.log(err);
//                         res.status(404).json({
//                             message: 'package not found'
//                         })
//                     } else {
//                         packageListData.push(result[0]);
//                     }
//                 }
        
//             })

router.get('/getListById/:listId/:user', async(req, res) => {
    const id = parseInt(req.params.listId);
    const delivery_man_id = parseInt(req.params.user);
    const query = "SELECT * FROM PackageList WHERE listId = ? AND deliveryManId = ?;";
    connection.query(query, [id, delivery_man_id], (err, result) => {
        var array = [];
        if(err) {
            console.log(err);
            return res.status(404).json({
                message: err.message
            })
        } else {
            const ids = result[0].packages.split(',');
            ids.forEach((id) => {
                const query = "SELECT * FROM package WHERE package_id = ?;";
                connection.query(query, id, (err, result) => {
                    if(err) {
                        console.log("ERROR: " + err.message);
                        res.status(404).json({
                            message: err.message,
                        });
                    }
                })
                array.push(result[0]);
            });
        }
        return res.status(200).json({
            data: array
        })
    })
    
})
    
module.exports = router;