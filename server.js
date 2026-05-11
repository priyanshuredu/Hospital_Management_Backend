const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT;

mongoose.connect(process.env.DB_URL)
.then(() => console.log("Database connected."))
.catch((error) => console.log("Error :",error))

app.use(cors({
    origin:"*"
}))
app.use(express.json());

app.listen(process.env.PORT ,() => {
    console.log(`Server is running on ${process.env.PORT}.`)
})