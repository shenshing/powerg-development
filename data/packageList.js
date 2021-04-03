const { response } = require('express');
const e = require('express');
const { rawListeners } = require('../database/dbService');
const connection = require('../database/dbService');
const { route } = require('./package');
const router = require('express').Router();
const { authRole } = require('../routes/validation');


router.post('/addList', async(req, res) => {
    const date = new Date();
    const dateAdded = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
    const { package, deliveryManId, listId } = req.body;
    const total = 0.00;

    if(listId === null || listId === undefined) {
        while(true) {
            const listId = Math.floor(Math.random() * 10000);
            let exist = await isListIdExist(listId);

            if(exist === false) {
                const query = "INSERT INTO PackageLists(listId, packages, total, deliveryManId, created_at) VALUES(?, ?, ?, ?, ?);";
                connection.query(query, [listId, package, total, deliveryManId, dateAdded], (err, result) => {
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
                break;
            }
        }
    } else {
        // if listId already exist
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
                            res.status(200).json({
                                message: 'package added'
                            })
                        }
                    }
                })
            }
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
}
router.get('/getListById/:listId', async(req, res) => {
    const id = parseInt(req.params.listId);
    const delivery_man_id = parseInt(req.params.user);
    const query = "SELECT * FROM PackageLists WHERE listId = ?;";
    connection.query(query, [id, delivery_man_id], (err, result) => {
        if(err) {
            console.log(err);
            return res.status(404).json({
                message: err.message
            })
        } else {
            const idData = result[0].packages.split(',');
                const query = "SELECT * FROM Packages WHERE package_id in (?)";
                connection.query(query, [idData], (err, result) => {
                    if(err) {
                        console.log("ERROR: " + err.message);
                        res.status(404).json({
                            message: err.message,
                        });
                    } else {
                        return res.status(200).json({
                            data: result
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
})
module.exports = router;

