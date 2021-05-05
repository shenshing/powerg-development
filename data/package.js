const connection = require('../database/dbService');
const path = require('path');
const router = require('express').Router();
const {calculateCOD}  = require('../services/service');
const { get } = require('http');
const url = require('url');
const querystring = require('querystring');

const { authRole } = require('../routes/validation');

router.post('/addPackage', authRole('admin'), async (req, res) => {
    const tz = new Date();
    console.log('local ' + tz);
    const date = new Date();
    const dateAdded = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
    console.log('date added ' + dateAdded);
    const status = 'PENDING';
    const { shop_owner, cust_name, cust_location, cust_phone, pro_price, payment_method, service_fee, service_paid_by } = req.body;
    const pack = {
        payment_method: payment_method,
        service_paid_by: service_paid_by,
        pro_price: pro_price,
        service_fee: service_fee
    };
    let package_price = calculateCOD(pack);
    console.log(package_price);
    try {
        const query = "INSERT INTO Packages(shop_owner, cust_name, cust_location, cust_phone, pro_price, payment_method, service_fee, service_paid_by, package_price, status, created_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        connection.query(query, [shop_owner, cust_name, cust_location, cust_phone, pro_price, payment_method, service_fee, service_paid_by, package_price, status, dateAdded], async (err, result) => {
            if (err) {
                console.log(err.message);
                res.status(404).json({
                    message: 'Something went wrong in our End'
                })
            } else {
                // const qr_id = 'QR' + result.insertId + '.png';
                // const qr_path = './images/' + qr_id;
                // const total_price = pro_price + service_fee;
                // const qr_url = `https://etalket.com/?package_id=${result.insertId}&cust_name=${cust_name}&location=${cust_location}&phone_number=${cust_phone}&shop_owner=${shop_owner}&service_fee=${service_fee}&price=${pro_price}&total=${total_price}`;

                // await QRCode.toFile(qr_path, qr_url);
                // // res.status(200).json({
                // //     message: "Successful add package",
                // //     url: qr_url
                // // })
                // res.sendFile(path.join(__dirname, '../images', qr_id));
                res.status(200).json({
                    package_id: result.insertId,
                    message: 'Package successful added'
                });
            }
        })
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});


router.get('/getAllPackage', authRole('admin'), async (req, res) => {
    try {
        const query = "SELECT * FROM Packages;";
        connection.query(query, async (err, result) => {
            if (err) {
                console.log(err);
                res.status(404).json({
                    message: 'Something went wrong in our End'
                })
            } else {
                res.status(200).json({
                    data: result
                })
            }
        })
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});

router.post('/finalUpdate', async(req, res) => {
    const {listId, data} = req.body;
    console.log('listId : ' + listId);
    console.log('data : ' + data);

    const totalIndex = data.length;
    var success = [];
    var unsuccess = [];

    for(let i = 0; i<totalIndex; i++) {
        let record = data[i];
        let packageId = record.package_id;
        let packageStatus = record.status;
        let others = record.others;
        const query = `UPDATE Packages SET status = '${packageStatus}', others = '${others}' WHERE package_id = ${packageId};`;
        connection.query(query, (err, result) => {
            if(err) {
                console.log(`error on package_id[${packageId}] : `+ err.message);
                unsuccess.push({
                    errorPackageId: packageId,
                    errorMessage: err.message
                })
            } else {
                success.push(packageId);
            }
            if(i === totalIndex - 1) {
                const query = `UPDATE PackageLists SET submitted = true WHERE listId = ${listId};`;
                connection.query(query, (err, result) => {
                    if(err) {
                        console.log(err);
                        res.status(404).json({
                            message: err.message
                        })
                    } else {
                        res.status(200).json({
                            message: 'successful update',
                            success: success,
                            unsuccess: unsuccess
                        })
                    }
                })
            }
        })
    }    
});

router.put('/updatePackageById', (req, res) => {
    const package = req.body;
    console.log(package);

    res.status(200).json({
        message: 'ok'
    })
});

router.get('/getAllPackageByDate', authRole('admin'), (req, res) => {
    const date = req.query.date;
    console.log(date);
    const query = `SELECT * FROM Packages WHERE created_at = '${date}';`;
    connection.query(query,  (err, result) => {
        if(err) {
            console.log(err);
            res.status(404).json({
                message: 'Something went wrong in our End'
            })
        } else {
            if(result.length < 0) {
                res.status(200).json({
                    message: 'no information exist'
                })
            } else {
                res.status(200).json({
                    message: 'ok',
                    data: result
                })
            }
        }
    })
});

router.get('/countOnGoingByDate', authRole('admin'), (req, res) => {
    const date = req.query.date;
    const query = `SELECT * FROM Packages WHERE created_at = '${date}' AND status = 'ON GOING';`;
    connection.query(query, (err, result) => {
        if(err) {
            console.log(err);
            res.status(404).json({
                message: err.message
            })
        } else {
            if(result.length < 0) {
                res.status(200).json({
                    message: 'no information exist'
                })
            } else {
                res.status(200).json({
                    message: 'ok',
                    total: result.length,
                    data: result
                })
            }
        }
    })
});

router.get('/countPackageByDate', authRole('admin'), (req, res) => {
    const date = req.query.date;
    const query = `SELECT * FROM Packages WHERE created_at = '${date}'`;
    connection.query(query, date, (err, result) => {
        if(err) {
            console.log(err);
            res.status(404).json({
                message: err.message
            })
        } else {
            if(result.length < 0) {
                res.status(200).json({
                    message: 'no information exist'
                })
            } else {
                res.status(200).json({
                    message: 'ok',
                    total: result.length,
                    data: result
                })
            }
        }
    })
});

router.get('/countSuccessByDate', authRole('admin'), (req, res) => {
    const date = req.query.date;

    const query = `SELECT * FROM Packages WHERE created_at = '${date}';`;
    connection.query(query, (err, result) => {
        if(err) {
            console.log(err);
            res.status(404).json({
                message: err.message
            })
        } else {
            if(result.length === 0) {
                res.status(200).json({
                    message: 'no data exist',
                    total: result.length
                })
            } else {
                res.status(200).json({
                    message: 'ok',
                    total: result.length,
                    data: result
                })
            }
        }
    })
});

router.get('/countUnSuccessByDate', authRole('admin'), (req, res) => {
    const date = req.query.date;
    const query = `SELECT * FROM Packages WHERE created_at = '${date}' AND status = 'UNSUCCESS';`;
    connection.query(query, (err, result) => {
        if(err) {
            console.log(err);
            res.status(404).json({
                message: err.message
            })
        } else {
            if(result.length < 0) {
                res.status(200).json({
                    message: 'no information exist'
                })
            } else {
                res.status(200).json({
                    message: 'ok',
                    total: result.length,
                    data: result
                })
            }
        }
    })
});

router.delete('/deletePackageById/:id', authRole('admin'), (req, res) => {
    const id = parseInt(req.params.id);
    const query = "DELETE FROM Packages WHERE package_id = ?;";
    connection.query(query, id, (err, result)=> {
        if(err) {
            console.log(err);
            res.status(404).json({
                message: err.message
            })
        } else {
            res.status(200).json({
                message: 'package deleted'
            })
        }
    })
});



module.exports = router;
