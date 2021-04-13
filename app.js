const express = require('express');
const app = express();
const mysql = require('mysql2');
const QRCode = require('qrcode');
const cors = require('cors');


const authRoute = require('./routes/auth');
const Package = require('./data/package');
const dbService = require('./database/dbService');
const server = require('./routes/server');
const shopReport = require('./report/shop');
const packageList = require('./data/packageList');
const delivery = require('./report/delivery_man');

// const {isAdmin} = require('./routes/validation');

// const data = isAdmin('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwicm9sZSI6InVzZXIiLCJpYXQiOjE2MTQyNDcyNzF9.ZZWrZS5pSp41IYqJ8jSqF22nv9DULm0HO5DzpQ5MYxU');
// const data = isAdmin('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6ImFkbWluIiwiaWF0IjoxNjE0MjQ4ODE5fQ.1BRlh0YoEhJdBBsBmth4ur0RMQo3K6BBT_nfTnjHD0c');
// console.log(data);

// const generateQR = async text => {
//     try {
//         // let result = await QRCode.toFile('../images/qr.png', text);  
//         let result = await QRCode.toFile('./images/qr.png', text);
//         console.log(result);
//     } catch (err) {
//         console.log('Error -> ' + err);
//     }
// };

// generateQR('etalket.com');
// app.use()
// app.use(function(req, res, next) {
//     res.header('date', '*'),
//     next();
// });
app.use(cors());
app.use(express.json());
app.use('/', server);
app.use('/api/user', authRoute);
app.use('/package', Package);
app.use('/shop', shopReport);
app.use('/packageList', packageList);
app.use('/delivery', delivery);


app.listen(3001, () => {
    console.log('Server up and Running');
});
