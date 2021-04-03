const express = require('express');
const app = express();
const mysql = require('mysql2');
const QRCode = require('qrcode');
const cors = require('cors');


const authRoute = require('./routes/auth');
const Package = require('./data/package');
const dbService = require('./database/dbService');
const server = require('./routes/server');
const shopReport = require('./data/shop');
const packageList = require('./data/packageList');

app.use(cors());
app.use(express.json());
app.use('/', server);
app.use('/api/user', authRoute);
app.use('/package', Package);
app.use('/shop', shopReport);
app.use('/packageList', packageList);



app.listen(3001, () => {
    console.log('Server up and Running');
});
