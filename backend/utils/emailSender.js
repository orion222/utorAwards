const nodemailer = require("nodemailer");

const dotenv = require("dotenv");
dotenv.config();

const senderEmail = process.env.EMAIL_USER;
const senderPassword = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: senderEmail,
        pass: senderPassword
    },
    tls: {
        rejectUnauthorized: false
    }
});

async function sendResetPasswordEmail(recipientEmail, resetToken) {
    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}&email=${recipientEmail}`;

    await transporter.sendMail({
        from: senderEmail,
        to: recipientEmail,
        subject: "[UtorAwards] Reset your password",
        html: `
            <h2>[UtorAwards] Password Reset Info</h2>
            <p>A request has been received to change the password for your UtorAwards account.</p>
            <p>Click the link below to reset:</p>
            <a href="${resetUrl}">Reset Password</a>
            <p>This link expires in 1 hour.</p>
            <p>Didn't request a password reset? Feel free to ignore this email.</p>
        `
    });
}

module.exports = { sendResetPasswordEmail }