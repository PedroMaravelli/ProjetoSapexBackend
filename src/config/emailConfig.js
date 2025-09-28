const nodemailer = require("nodemailer");
require('dotenv').config();


const transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.HOST_EMAIL || "smtp.gmail.com",
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true' || false,
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASSWORD_EMAIL,
    },
});


module.exports = {transporter};