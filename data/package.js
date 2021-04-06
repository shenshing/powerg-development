const connection = require('../database/dbService');
const path = require('path');
const QRCode = require('qrcode');
const router = require('express').Router();

router.post('/addPackage', async (req, res) => {
    const date = new Date();
    const dateAdded = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
    // const dateAdded = date.getUTCDate() + (date.getUTCMonth() + 1) + date.getUTCFullYear();
    // const dateAdded = mo
    console.log(dateAdded);
    const status = 'PENDING';
    const { shop_owner, cust_name, cust_location, cust_phone, pro_price, payment_method, service_fee, service_paid_by } = req.body;
    try {
        const query = "INSERT INTO Packages(shop_owner, cust_name, cust_location, cust_phone, pro_price, payment_method, service_fee, service_paid_by, status, created_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        connection.query(query, [shop_owner, cust_name, cust_location, cust_phone, pro_price, payment_method, service_fee, service_paid_by, status, dateAdded], async (err, result) => {
            // console.log(result);
            if (err) {
                console.log(err);
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
                    package_id: result.insertId
                });
            }
        })
    } catch (error) {
        // console.log(error);
        res.status(404).json({
            message: error.message
        });
    }
});


router.get('/getAllPackage', async (req, res) => {
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
    const body = req.body;
    // console.log(body);

    // // console.log('--------------');
    // // const bodyList = body[0];
    // // console.log(bodyList);

    const totalIndex = body.length;
    var success = [];
    var unsuccess = [];

    for(let i = 0; i<totalIndex; i++) {
        let record = body[i];
        let packageId = record.package_id;
        let packageStatus = record.status;
        const query = "UPDATE Packages SET status = ? WHERE package_id = ?;";
        connection.query(query, [packageStatus, packageId], (err, result) => {
            if(err) {
                console.log(`error on package_id[${packageId}] : `+ err.message);
                // success.push(`id: ${packageId} : unsuccess`);
                unsuccess.push({
                    errorPackageId: packageId,
                    errorMessage: err.message
                })
                // unsuccess.push(packageId);
            } else {
                // success.push(`id: ${packageId} : success`); 
                // console.log(result);
                success.push(packageId);
            }
            if(i === totalIndex - 1) {
                res.status(200).json({
                    message: 'successful update',
                    success: success,
                    unsuccess: unsuccess
                })
            }
        })
    }
    // res.status(200).json({
    //     message: 
    // })
})


module.exports = router;
