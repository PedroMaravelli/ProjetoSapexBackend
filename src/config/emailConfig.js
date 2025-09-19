const nodemailer = require("nodemailer");
require('dotenv').config();


const transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.HOST_EMAIL,
    port: 587,
    secure: false,
auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.PASSWORD_EMAIL,
    },
});


module.exports = {transporter};