const nodemailer = require("nodemailer");

const dotenv = require("dotenv");
dotenv.config();

const senderEmail = process.env.EMAIL_USER;
const senderPassword = process.env.EMAIL_PASSWORD;
const frontendURL = process.env.FRONTEND_URL;

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

async function sendResetPasswordEmail(recipientEmail, resetToken, isNewUser) {

    const url = `${frontendURL}/${isNewUser ? 'create' : 'reset'}-password?token=${resetToken}&email=${recipientEmail}`;
    
    const templates = {
    newUser: {
        subject: "[UTORAwards] Welcome! Create your password",
        mainText: "Welcome to UTORAwards! A new account has been created for you.<br/><br/>Click the button below to create your password and activate your account:",
        buttonText: "Create Password",
        expiryText: "This link will expire in 7 days.",
        ignoreText: "If you <strong>did not</strong> expect this email, you can safely ignore it.",
        footerText: "This automated message was sent to create your account password."
    },
    resetPassword: {
        subject: "[UTORAwards] Reset your password",
        mainText: "A request was made to reset the password for your UTORAwards account.<br/><br/>Click the button below to choose a new password:",
        buttonText: "Reset Password",
        expiryText: "This link will expire in 1 hour.",
        ignoreText: "If you <strong>did not request</strong> a password reset, you can safely ignore this email.",
        footerText: "This automated message was sent because a password reset was requested for your account."
    }
};

    const { subject, mainText, buttonText, expiryText, ignoreText, footerText } = isNewUser ? templates.newUser : templates.resetPassword;

    await transporter.sendMail({
        from: senderEmail,
        to: recipientEmail,
        subject,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #232715;">
                <h2 style="color: #7CD93A;">UTORAwards</h2>

                <p>Hello,</p>
                <p>${mainText}</p>

                <a 
                    href="${url}" 
                    style="
                    display: inline-block;
                    margin: 16px 0;
                    padding: 12px 20px;
                    background-color: #7CD93A;
                    color: #232715;
                    text-decoration: none;
                    font-weight: bold;
                    border-radius: 6px;
                    "
                >
                    ${buttonText}
                </a>

                <p>${expiryText}</p>

                <p>${ignoreText}</p>

                <p style="margin-top: 24px;">
                    Stay safe,<br />
                    <strong>The UTORAwards Team</strong>
                </p>

                <hr style="margin: 24px 0; border: none; border-top: 1px solid #D9DCCF;" />

                <p style="font-size: 12px; color: #6B6F5A;">
                    ${footerText}
                </p>
            </div>
        `
    });
}

async function sendPasswordChangeEmail(recipientEmail) {
    await transporter.sendMail({
        from: senderEmail,
        to: recipientEmail,
        subject: "[UTORAwards] Your password has changed",
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #232715;">
            <h2 style="color: #7CD93A;">UTORAwards</h2>

            <p>Hello,</p>

            <p>
                This is a confirmation that the password associated with your
                UTORAwards account was recently changed.
            </p>

            <p>
            If <strong>you made this change</strong>, no further action is needed.
            </p>

            <p>
                If you <strong>did not</strong> request this change, please reset your password 
                immediately and contact support.
            </p>

            <p style="margin-top: 24px;">
                Stay safe,
                <br />
                <strong>The UTORAwards Team</strong>
            </p>

            <hr style="margin: 24px 0; border: none; border-top: 1px solid #D9DCCF;" />

            <p style="font-size: 12px; color: #6B6F5A;">
                This automated message was sent to confirm a security-related update on your account.
            </p>
        </div>
        `
    });
}

module.exports = { sendResetPasswordEmail, sendPasswordChangeEmail }