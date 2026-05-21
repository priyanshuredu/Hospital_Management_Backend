const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const uploadFile = require('express-fileupload');
const adminRoute = require('./route/adminRoute');
const userRoute = require('./route/userRoute');
const locationRoute = require('./route/locationRoute');
const hospitalRoute = require('./route/hospitalRoute');
const departmentRoute = require('./route/departmentRoute');
const subDepartmentRoute = require('./route/subdepartmentRoute');
const hospitalImageRoute = require('./route/hospitalImageRoute');
const doctorImageRoute = require('./route/doctorImageRoute');
const doctorRoute = require('./route/doctorRoute');
const labRoute = require('./route/labRoute');
const fileUpload = require('express-fileupload');

const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT;

mongoose.connect(process.env.DB_URL)
.then(() => console.log("Database connected."))
.catch((error) => console.log("Error :",error))

app.use(cors({
    origin:"*"
}))
app.use(express.urlencoded());
app.use(fileUpload());
app.use(express.json());
app.use('/admin', adminRoute);
app.use('/user', userRoute);
app.use('/location', locationRoute);
app.use('/hospital', hospitalRoute);
app.use('/department', departmentRoute);
app.use('/sub-department', subDepartmentRoute);
app.use('/hospital-img', hospitalImageRoute);
app.use('/doctor-img', doctorImageRoute);
app.use('/doctor', doctorRoute);
app.use('/lab', labRoute);

app.listen(process.env.PORT ,() => {
    console.log(`Server is running on ${process.env.PORT}.`)
})