const express = require('express');
const cors = require('cors');

require('dotenv').config();
require('./config/db_conn');

const app = express();
const port = process.env.PORT || 3004;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/payments', require('./routes/paymentRouter'));

app.listen(port, () => {
    console.log(`payment-service running on port ${port}`);
});
