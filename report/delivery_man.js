const connection = require('../database/dbService');

const router = require('express').Router();
const {countPackage} = require('../services/service');

const { authRole } = require('../routes/validation');


router.get('/commission', authRole('admin'), (req, res) => {

    const start = req.query.start;
    const end = req.query.end;
    const name = req.query.name;
    
    console.log('start: ' + start);
    console.log('end ' + end);

    const query = `SELECT * FROM Packages WHERE delivery_man_name = '${name}' AND STR_TO_DATE(created_at, '%Y/%m/%d') BETWEEN '${start}' AND '${end}';`;
    console.log(query);
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
                const count = countPackage(result);
                res.status(200).json({
                    message: 'ok',
                    totalAmount: (count.total_success * 0.2).toFixed(4),
                    report: count,
                    data: result
                })
            }
        }
    })
});

module.exports = router;