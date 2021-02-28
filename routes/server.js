const router = require('express').Router();

// const {isAdmin} = require('./validation');
const { authRole } = require('./validation');

router.get('/', authRole('admin'), (req, res) => {
    // res.status(200).json({
    //     message: "server up and running"
    // })

    res.status(200).send('server up and running');
});


module.exports = router;