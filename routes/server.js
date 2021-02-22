const router = require('express').Router();

router.get('/', (req, res) => {
    // res.status(200).json({
    //     message: "server up and running"
    // })

    res.status(200).send('server up and running');
});


module.exports = router;