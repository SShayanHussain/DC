const express = require('express');
const cors = require('cors');

require('dotenv').config();
require('./config/db_conn');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', require('./routes/userRouter'));

app.listen(port, () => {
    console.log(`auth-service running on port ${port}`);
});
