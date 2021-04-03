const connection = require('../database/dbService');
const path = require('path');
const router = require('express').Router();

router.post('/addPackage', async (req, res) => {
    const date = new Date();
    const dateAdded = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
    console.log(dateAdded);
    const status = 'PENDING';
    const { shop_owner, cust_name, cust_location, cust_phone, pro_price, payment_method, service_fee, service_paid_by } = req.body;

    const query = "INSERT INTO Packages(shop_owner, cust_name, cust_location, cust_phone, pro_price, payment_method, service_fee, service_paid_by, status, created_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    connection.query(query, [shop_owner, cust_name, cust_location, cust_phone, pro_price, payment_method, service_fee, service_paid_by, status, dateAdded], async (err, result) => {
        if (err) {
            console.log(err);
            res.status(404).json({
                message: 'Something went wrong in our End'
            })
        } else {
            res.status(200).json({
                package_id: result.insertId
            });
        }
    })
});


router.get('/getAllPackage', async (req, res) => {
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
})
module.exports = router;
