const router = require('express').Router();
const connection = require('../database/dbService');
const { authRole } = require('../routes/validation');


router.get('/generateReport', authRole('admin'), (req, res) => {
    const start = req.query.date;
    const shop = req.query.shop;

    const query = "SELECT * FROM Packages WHERE created_at = ? AND shop_owner = ?;";
    connection.query(query, [start, shop], (err, packages) => {
        if (err) {
            return res.status(404).json({
                message: err.message
            })
        } else if (packages.length <= 0) {
            return res.status(404).json({
                message: 'no data exist',
            })
        }
        let total_amount = 0.00;
        let total_success = 0;
        let total_unsuccess = 0;
        let case1 = 0;
        let case2 = 0;
        let case3 = 0;
        let case4 = 0;
        let shop_get;

        packages.forEach(package => {
            if (package.status === 'SUCCESS') {
                total_success = total_success + 1;
                if (package.payment_method === 'COD' && package.service_paid_by === 'Transferer') {
                    shop_get = package.pro_price - package.service_fee;
                    total_amount = total_amount + shop_get;
                    case1 = case1 + 1;
                }
                if (package.payment_method === 'COD' && package.service_paid_by === 'Receiver') {
                    shop_get = package.pro_price;
                    total_amount = total_amount + shop_get;
                    case2 = case2 + 1;
                }
                if (package.payment_method === 'Paid' && package.service_paid_by === 'Transferer') {
                    shop_get = -package.service_fee;
                    total_amount = total_amount + shop_get;
                    case3 = case3 + 1;
                }
                if (package.payment_method === 'Paid' && package.service_paid_by === 'Receiver') {
                    shop_get = 0;
                    total_amount = total_amount + shop_get;
                    case4 = case4 + 1;
                }
            } else {
                total_unsuccess = total_unsuccess + 1;
            }
        })

        return res.status(200).json({
            message: "ok",
            total_package: packages.length,
            success: total_success,
            unsuccess: total_unsuccess,
            total_amount
        })
    });
});


router.get('/dailyShopReport', authRole('admin'), (req, res) => {
    const date = req.query.date;
    const shop = req.query.shop;

    const query = "SELECT * FROM Packages WHERE delivered_at = ? AND shop_owner = ?;";
    connection.query(query, [date, shop], (err, packages) => {
        if (err) {
            return res.status(404).json({
                message: err.message
            })
        } else if (packages.length <= 0) {
            return res.status(404).json({
                message: 'no data exist',
            })
        }
        let total_amount = 0.00;
        let total_success = 0;
        let total_unsuccess = 0;
        let total_ongoing = 0;
        let shop_get;

        packages.forEach(package => {
            if (package.status === 'SUCCESS') {
                total_success = total_success + 1;
                if (package.payment_method === 'COD' && package.service_paid_by === 'Transferer') {
                    shop_get = package.pro_price - package.service_fee;
                    total_amount = total_amount + shop_get;
                }
                if (package.payment_method === 'COD' && package.service_paid_by === 'Receiver') {
                    shop_get = package.pro_price;
                    total_amount = total_amount + shop_get;
                }
                if (package.payment_method === 'Paid' && package.service_paid_by === 'Transferer') {
                    shop_get = -package.service_fee;
                    total_amount = total_amount + shop_get;
                }
                if (package.payment_method === 'Paid' && package.service_paid_by === 'Receiver') {
                    shop_get = 0;
                    total_amount = total_amount + shop_get;
                }
            } else if(package.status === 'ON GOING') {
                total_ongoing = total_ongoing + 1;
            } else {
                total_unsuccess = total_unsuccess + 1;
            }
        })

        return res.status(200).json({
            message: "ok",
            total_package: packages.length,
            success: total_success,
            unsuccess: total_unsuccess,
            ongoing: total_ongoing,
            total_amount
        })
    });
});

router.get('/dailyReport', authRole('admin'), (req, res) => {
    const date = req.query.date;

    const query = "SELECT * FROM Packages WHERE delivered_at = ?;";
    connection.query(query, [date], (err, packages) => {
        if (err) {
            return res.status(404).json({
                message: err.message
            })
        } else if (packages.length <= 0) {
            return res.status(404).json({
                message: 'no data exist',
            })
        }
        let total_amount = 0.00;
        let total_success = 0;
        let total_unsuccess = 0;
        let total_ongoing = 0;
        let shop_get;

        packages.forEach(package => {
            if (package.status === 'SUCCESS') {
                total_success = total_success + 1;
                if (package.payment_method === 'COD' && package.service_paid_by === 'Transferer') {
                    shop_get = package.pro_price - package.service_fee;
                    total_amount = total_amount + shop_get;
                }
                if (package.payment_method === 'COD' && package.service_paid_by === 'Receiver') {
                    shop_get = package.pro_price;
                    total_amount = total_amount + shop_get;
                }
                if (package.payment_method === 'Paid' && package.service_paid_by === 'Transferer') {
                    shop_get = -package.service_fee;
                    total_amount = total_amount + shop_get;
                }
                if (package.payment_method === 'Paid' && package.service_paid_by === 'Receiver') {
                    shop_get = 0;
                    total_amount = total_amount + shop_get;
                }
            } else if(package.status === 'ON GOING') {
                total_ongoing = total_ongoing + 1;
            } else {
                total_unsuccess = total_unsuccess + 1;
            }
        })

        return res.status(200).json({
            message: "ok",
            total_package: packages.length,
            success: total_success,
            unsuccess: total_unsuccess,
            ongoing: total_ongoing,
            total_amount
        })
    });
});

router.post('/register', authRole('admin'), (req, res) => {
    const date = new Date();
    const dateAdded = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
    const { shopName, shopContact, shopAddress, ownerName, ownerContact, ownerAddress } = req.body;

    const query = "SELECT * FROM Shops WHERE shopName = ?;";
    connection.query(query, shopName, (err, result) => {
        if(err) {
            console.log(err);
            res.status(404).json({
                message: err.message
            })
        } else {
            if(result.length > 0) {
                res.status(409).json({
                    message: 'shop already exist'
                })
            } else {
                const query = "INSERT IGNORE INTO Shops(shopName, shopContact, shopAddress, ownerName, ownerContact, ownerAddress, createdAt) VALUES(?, ?, ?, ?, ?, ?, ?);";
                connection.query(query, [shopName, shopContact, shopAddress, ownerName, ownerContact, ownerAddress, dateAdded], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(404).json({
                            message: err.message
                        })
                    } else {
                        res.status(200).json({
                            message: 'success',
                            shopId: result.insertId
                        })
                    }
                })
            }
        }
    });
});

router.get('/getAllShops', authRole('admin'), (req, res) => {
    const query = "SELECT * FROM Shops";
    connection.query(query, (err, result) => {
        if(err) {
            console.log(err);
            res.status(404).json({
                message: err.message
            })
        } else {
            if(result.length === 0) {
                res.status(404).json({
                    message: 'no shop exist',
                })
            } else {
                res.status(200).json({
                    message: 'success',
                    data: result,
                    totalShop: result.length
                })
            }
        }
    })
});

router.get('/getShopByDate', authRole('admin'), (req, res) => {
    const date = req.query.date;
    const query = "SELECT DISTINCT shop_owner FROM Packages WHERE delivered_at = ?;";
    connection.query(query, date, (err, result) => {
        if(err) {
            console.log(err);
            res.status(404).json({
                message: err.message
            })
        } else {
            if(result.length === 0) {
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

router.delete('/deleteShop/:shopId', authRole('admin'), (req, res) => {
    const shopId = req.params.shopId;
    const query = "DELETE FROM Shops WHERE id = ?;";
    connection.query(query, shopId, (err, result) => {
        if(err) {
            console.log(err);
            return res.status(404).json({
                message: err.message
            })
        } else {
            return res.status(200).json({
                message: 'successful delete shop',
            })
        }
    })
});

router.get('/packageOfShopByDate', authRole('admin'), (req, res) => {
    const date = req.query.date;
    const shop = req.query.shop;

    const query = "SELECT * FROM Packages WHERE shop_owner = ? AND created_at = ?;";
    connection.query(query, [shop, date], (err, result) => {
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


module.exports = router;


// this is new line
// testing