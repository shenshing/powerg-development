const express = require('express');
const app = express();
const mysql = require('mysql2');
const authRoute = require('./routes/auth');
const dbService = require('./database/dbService');

app.use(express.json());
app.use('/api/user', authRoute);


app.listen(3000, () => {
    console.log('Server up and Running');
});