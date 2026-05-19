const express = require('express');
const cors = require('cors');

require('dotenv').config();
require('./config/db_conn');

const app = express();
const port = process.env.PORT || 3003;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/orders', require('./routes/cartRouter'));

app.listen(port, () => {
    console.log(`order-service running on port ${port}`);
});
