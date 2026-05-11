const nodemailer = require('nodemailer');
const Mail_Id = process.env.MAIL_ID;
const Mail_Pass = process.env.MAIL_PASS;

const transporter = nodemailer.createTransport({
    service:"gmail",
    port:465,
    auth:{
        user: Mail_Id,
        pass: Mail_Pass 
    },
    tls:{rejectUnauthorized: false}
})

