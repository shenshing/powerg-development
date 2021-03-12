const router = require('express').Router();
const connection = require('../database/dbService');
// const router = require('../routes/auth');


// SELECT *
// FROM events
// where event_date between '2018-01-01' and '2018-01-31';

const query_by_date = (start, end) => {
    let query_result;
    // const query = "SELECT * FROM package WHERE created_at BETWEEN ? AND ?;";
    const query = "SELECT * FROM package WHERE created_at = ?;"
    connection.query(query, [start], (err, result) => {
        // if (err) console.log('ERROR: ' + err.message);
        if (err) return 'ERROR: ' + err.message;
        console.log(result);
        // return result;
        query_result = result;
    });
    return query_result;
}


router.get('/generateReport', (req, res) => {
    // const data = query_by_date('2021-03-12', '2021-03-13');
    // const start = '2021-03-10';
    // const end = '2021-03-11';

    const start = req.header('start-date');
    const end = req.header('end-date');

    const query = "SELECT * FROM package WHERE created_at = ?;";
    connection.query(query, [start, end], (err, packages) => {
        // if (err) console.log('ERROR: ' + err.message);
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
        let total_package = 0;
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
                if (package.paymen_method === 'Paid' && package.service_paid_by === 'Transferer') {
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
            // data: [case1, case2, case3, case4],
            total_package: packages.length,
            success: total_success,
            unsuccess: total_unsuccess,
            total_amount
        })
    });

    // console.log(data);
    // res.status(200).json({
    //     message: 'from generateReport',
    //     data: data
    // })
})

module.exports = router;