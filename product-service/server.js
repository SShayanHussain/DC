const express = require('express');
const cors = require('cors');

require('dotenv').config();
require('./config/db_conn');

const app = express();
const port = process.env.PORT || 3002;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/products', require('./routes/productRouter'));
app.use('/filter', require('./routes/filterRouter'));

app.listen(port, () => {
    console.log(`product-service running on port ${port}`);
});
