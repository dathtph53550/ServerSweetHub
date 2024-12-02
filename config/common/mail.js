var nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "hoangdat07082005@gmail.com",
        pass: "Tiendat788"
    }
});

module.exports = transporter;