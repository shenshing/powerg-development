const { response } = require('express');
const e = require('express');
const connection = require('../database/dbService');
const router = require('express').Router();
const { authRole } = require('../routes/validation');
const {responseforDeliveryList}  = require('../services/service');


router.post('/addList', async(req, res) => {
    const date = new Date();
    const dateAdded = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
    const { package, deliveryManId, listId } = req.body;
    const total = 0.00;

    try {
        if(listId === null || listId === undefined) {
            while(true) {
                const listId = Math.floor(Math.random() * 10000);
                let exist = await isListIdExist(listId);

                if(exist === false) {
                    const query = "SELECT * FROM Users WHERE user_id = ?;";
                    connection.query(query, [deliveryManId], async(err, delivery_man) => {
                        if(err) {
                            console.log('1ERROR: ' + err.message);
                            res.status(500).json({
                                message: err.message
                            });
                        } else {
                            let exist_package = await isPackageExist(package);
                            if(exist_package === false) {
                                const res_message = `package id: ${package} not exist`;
                                res.status(404).json({
                                    message: res_message
                                })
                            } else {
                                const query = "INSERT INTO PackageLists(listId, packages, total, deliveryManId, deliveryManName, created_at) VALUES(?, ?, ?, ?, ?, ?);";
                                connection.query(query, [listId, package, total, deliveryManId, delivery_man[0].user_name, dateAdded], (err, result) => {
                                    if(err) {
                                        console.log('ERROR: ' + err.message);
                                        res.status(500).json({
                                            message: err.message
                                        });
                                    } else {
                                        const status = "ON GOING";
                                        const query = "UPDATE Packages SET status = ?, delivered_at = ?, delivery_man_name = ? WHERE package_id = ?;"; ///
                                        connection.query(query, [status, dateAdded, delivery_man[0].user_name, package], (err, result) => {
                                            if(err) {
                                                console.log('ERROR: ' + err.message);
                                                res.status(500).json({
                                                    message: err.message
                                                });
                                            } else {
                                                res.status(200).json({
                                                    message: 'list created successful',
                                                    listId: listId
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        }
                    })
                    break;
                }
            }
        } else {
            // if listId already exist
            let exist_package = await isPackageExist(package);
            if(exist_package === false) {
                const res_message = `package id: ${package} not exist`;
                res.status(404).json({
                    message: res_message
                })
            } else {
                const query = "SELECT packages FROM PackageLists WHERE listId = ?;";
                connection.query(query, listId, (err, result) => {
                    if(err) {
                        console.log(err);
                        res.status(404).json({
                            message: 'Something went wrong in our End'
                        })
                    } else {
                        let existPackage = result[0].packages;
                        existPackage = existPackage + ',' + package;
                        const query = "SELECT * FROM Users WHERE user_id = ?;";
                        connection.query(query, deliveryManId, (err, delivery_man) => {
                            if(err) {
                                console.log(err);
                                res.status(404).json({
                                    message: err.message
                                })
                            } else {
                                const query = "UPDATE PackageLists SET packages = ? WHERE listId  = ? AND deliveryManId = ?;";
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
                                            const status = "ON GOING";
                                            const query = "UPDATE Packages SET status = ?, delivered_at = ?, delivery_man_name = ? WHERE package_id = ?;"; ///
                                            connection.query(query, [status, dateAdded, delivery_man[0].user_name, package], (err, result) => {
                                                if(err) {
                                                    console.log('ERROR: ' + err.message);
                                                    res.status(500).json({
                                                        message: err.message
                                                    });
                                                } else {
                                                    res.status(200).json({
                                                        message: 'package added',
                                                        listId: listId
                                                    })
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                        })
                        
                    }
                })
            }
        }
    } catch (error) {
        res.status(404).json({
            message: error.message
        })
    } 
})


router.post('/checkNull', async(req, res, cb) => {
    const { data } = req.body;
    let count = 0;
    while(true) {
        let listId = Math.floor(Math.random() * 10);
        let a = await isListIdExist(listId);
        
        console.log(listId);
        
        if(a === false) {
            break;
        }
        count ++;
    }
    console.log('count = ' + count);
    res.status(200).json({
        message: 'finished'
    })
})



router.get('/getListById/:listId', async(req, res) => {
    const id = parseInt(req.params.listId);
    const delivery_man_id = parseInt(req.params.user);
    const query = "SELECT * FROM PackageLists WHERE listId = ?;";
    connection.query(query, [id, delivery_man_id], (err, result) => {
        // var array = [];
        if(err) {
            console.log(err);
            return res.status(404).json({
                message: err.message
            })
        } else {
            const idData = result[0].packages.split(',');
            const query = "SELECT * FROM Packages WHERE package_id in (?)";
            connection.query(query, [idData], (err, packages) => {
                if(err) {
                    console.log("ERROR: " + err.message);
                    res.status(404).json({
                        message: err.message,
                    });
                } else {
                    let response = [];
                    packages.forEach(package => {
                        response.push(responseforDeliveryList(package));
                    })
                    return res.status(200).json({
                        data: response
                    })
                }
            })
        }
    })
    
});

router.get('/getAllLists', authRole('admin'), (req, res) => {
    const query = "SELECT * FROM PackageLists;"
    connection.query(query, (err, result) => {
        if(err) {
            console.log(err);
            return res.status(404).json({
                message: err.message
            })
        } else {
            return res.status(200).json({
                message: 'success',
                data: result,
                totalList: result.length
            })
        }
    })
});


router.delete('/deleteListById/:listId', authRole('admin'), (req, res) => {
    const listId = req.params.listId;
    const query = "DELETE FROM PackageLists WHERE listId = ?;";
    connection.query(query, listId, (err, result) => {
        if(err) {
            console.log(err);
            return res.status(404).json({
                message: err.message
            })
        } else {
            return res.status(200).json({
                message: 'successful delete list',
            })
        }
    })
});

router.get('/getListByDateId', (req, res) => {
    const date = req.query.date;
    // const end = req.query.end;
    const del_id = req.query.id;
    const del_name = req.query.name;

    const query = `SELECT * FROM PackageLists WHERE created_at = '${date}' AND deliveryManId = ${del_id} AND deliveryManName = '${del_name}' AND submitted = false`;
    console.log(query);
    connection.query(query, (err, result) => {
        if(err) {
            console.log(err);
            return res.status(404).json({
                message: err.message
            })
        } else {
            if(result.length === 0) {
                res.status(200).json({
                    message: 'no data exist'
                })
            } else {
                res.status(200).json({
                    message: 'ok',
                    data: result
                })
            }
        }
    })
})



function isListIdExist(id) {
    return new Promise(function(resolve, reject) {
        const query = "SELECT * FROM PackageLists WHERE listId = ?;";
        connection.query(query, id, (err, result) => {
            // console.log('length: ' + result.length);
            // console.log('result data ' + result[0]);
            // console.log('-----------');
            if(err) {
                resolve(false);
            }
            if(result.length > 0) {
                resolve(true);
            } else {
                resolve(false);
            }
        })
    })
};

function isPackageExist(id) {
    return new Promise(function(resolve, reject) {
        const query = `SELECT * FROM Packages Where package_id = ${id};`;
        console.log(query);
        connection.query(query, (err, result) => {
            // console.log(result);
            if(err) {
                // console.log('a');
                resolve(false);
            }
            // console.log(result.length);
            if(result.length > 0) {
            //     console.log('b');
                resolve(true);
            } else {
                // console.log('c');
                resolve(false);
            }
        })
    })
}

module.exports = router;

