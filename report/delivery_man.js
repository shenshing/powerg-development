const connection = require('../database/dbService');

const router = require('express').Router();
const {countPackage} = require('../services/service');


router.get('/commission', (req, res) => {

    const start = req.query.start;
    const end = req.query.end;
    const name = req.query.name;
    

    const query = `SELECT * FROM Packages WHERE delivery_man_name = '${name}' AND created_at BETWEEN '${start}' AND '${end}';`;
    connection.query(query, (err, result) => {
        if(err) {
            console.log(err.message);
            res.status(404).json({
                message: 'Something wen wrong in our end',
                errMessage: err.message
            })
        } else {
            if(result.length < 0) {
                res.status(200).json({
                    message: 'no data exist'
                })
            } else {
                // console.log(countPackage(result));
                const count = countPackage(result);
                res.status(200).json({
                    message: 'ok',
                    totalAmount: count.total_success * 1000,
                    report: count,
                    data: result
                })
            }
        }
    })
    // const date = '2021/4/11';
    // const date_type = new Date(date).toLocaleDateString();
    // console.log(date_type);

    // res.status(200).json({
    //     message: 'ok'
    // })
});


// select *from yourTableName where STR_TO_DATE(LEFT(yourColumnName,LOCATE('',yourColumnName)),'%m/%d/%Y') BETWEEN 'yourDateValue1' AND 'yourDateValue2’;


module.exports = router;