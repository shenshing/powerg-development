const connection = require('../database/dbService');
const path = require('path');
const QRCode = require('qrcode');
const router = require('express').Router();

router.post('/addPackage', async(req, res) => {
    const dateAdded = new Date();
    const { shop_owner, cust_name, cust_location, cust_phone, pro_price, payment_method, service_fee, service_paid_by } = req.body;
    try {
        const query =  "INSERT INTO package(shop_owner, cust_name, cust_location, cust_phone, pro_price, payment_method, service_fee, service_paid_by, created_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";
        connection.query(query, [shop_owner, cust_name, cust_location, cust_phone, pro_price, payment_method, service_fee, service_paid_by, dateAdded], async(err, result) => {
            // console.log(result);
            if (err) {
                console.log(err);
                res.status(404).json({
                    message: 'Something went wrong in our End'
                })
            } else {
                const qr_id = 'QR' + result.insertId + '.png';
                const qr_path = './images/' + qr_id;
                const total_price = pro_price + service_fee;
                // console.log(qr_path);
                const qr_url = `https://etalket.com/?package_id=${result.insertId}&cust_name=${cust_name}&location=${cust_location}&phone_number=${cust_phone}&shop_owner=${shop_owner}&service_fee=${service_fee}&price=${pro_price}&total=${total_price}`;




                await QRCode.toFile(qr_path, qr_url);
                // res.status(200).json({
                //     message: "Successful add package",
                //     url: qr_url
                // })
                res.sendFile(path.join(__dirname, '../images', qr_id));
            }
        })
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
