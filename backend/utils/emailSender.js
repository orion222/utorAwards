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

async function sendResetPasswordEmail(recipient, resetToken) {
    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

    await transporter.sendMail({
        from: senderEmail,
        to: recipient,
        subject: "UtorAwards: Reset your password",
        html: `
            <h2>Reset Your Password</h2>
            <p>Click below to reset:</p>
            <a href="${resetUrl}">Reset Password</a>
            <p>This link expires in 1 hour.</p>
        `
    });
}

module.exports = { sendResetPasswordEmail }