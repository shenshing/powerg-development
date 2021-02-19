const express = require('express');
const app = express();
const mysql = require('mysql2');
const QRCode = require('qrcode');


const authRoute = require('./routes/auth');
const Package = require('./data/package');
const dbService = require('./database/dbService');

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

app.use(express.json());
app.use('/api/user', authRoute);
app.use('/package', Package);
app.use(cors());

app.listen(3000, () => {
    console.log('Server up and Running');
});
