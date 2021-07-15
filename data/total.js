const router = require('express').Router();
const connection = require('../database/dbService');
const { authRole } = require('../routes/validation');
const { route } = require('./shop');

// router.get('/grandTotal', (req, res) => {
//     const date = req.query.date;

//     return res.status(200).json({
//         message: 'ok',
//         serviceFee: totalServiceFee(date)
//     })
// })

router.get('/totalServiceFee'/*, authRole('admin')*/, (req, res) => {
    const date = req.query.date;

    const query = `SELECT * FROM Packages WHERE created_at = '${date}' AND status = 'SUCCESS';`;
    console.log(query);
    connection.query(query, (err, packages) => {
        if (err) {
            return res.status(404).json({
                message: err.message
            })
        } else if (packages.length <= 0) {
            return res.status(404).json({
                message: 'no data exist',
            })
        }
        return res.status(200).json({
            message: 'ok',
            totalServiceFee: calculateTotalServiceFee(packages)
        })
    });
});

router.get('/totalEachShop', (req, res) => {
    const date = req.query.date;

    const query = `SELECT  shop_owner, SUM(package_price) as total  FROM Packages  WHERE created_at = '${date}' AND status = 'SUCCESS' AND payment_method = 'COD' GROUP BY shop_owner;`;
    console.log(query);

    connection.query(query, (err, result) => {
        if (err) {
            return res.status(404).json({
                message: err.message
            })
        } else if (result.length <= 0) {
            return res.status(404).json({
                message: 'no data exist',
            })
        }
        let totalMinusShop = [];
        let totalPlusShop = [];
        result?.forEach(shop => {
            if(shop.total < 0) {
                totalMinusShop.push(shop);
            } else {
                totalPlusShop.push(shop);
            }
        })

        let totalAmountForPlusShop = 0;
        totalPlusShop?.forEach(shop => {
            totalAmountForPlusShop = totalAmountForPlusShop + shop.total;
        })

        let totalAmountForMinusShop = 0;
        totalMinusShop?.forEach(shop => {
            totalAmountForMinusShop = totalAmountForMinusShop + shop.total;
        })

        return res.status(200).json({
            message: 'ok',
            data: {
                all: result,
                plusShop: {
                    data: totalPlusShop,
                    total: totalAmountForPlusShop
                },
                minusShop: {
                    data:  totalMinusShop,
                    total: totalAmountForMinusShop
                }
            }
            // totalFeeAmount: 0
        })
    });
})

function calculateTotalServiceFee(packages, date) {
    // const query = `SELECT * FROM Packages WHERE created_at = '${date}' AND status = 'SUCCESS';`;
    // console.log(query);
    // connection.query(query, (err, packages) => {
    //     if (err) {
    //         return res.status(404).json({
    //             message: err.message
    //         })
    //     } else if (packages.length <= 0) {
    //         return res.status(404).json({
    //             message: 'no data exist',
    //         })
    //     }
    //     return res.status(200).json({
    //         message: 'ok',
    //         totalServiceFee: calculateTotalServiceFee(packages)
    //     })
    // });

    let totalServiceFee = 0;
    packages.forEach(package => {
        totalServiceFee = totalServiceFee + package.service_fee;
    });
    return totalServiceFee;
}

module.exports = router;