const express = require('express');
const { generateJWT, resetPassword, requestPasswordReset } = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

const authRouter = express.Router();

const forgotPasswordLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 1,
    message: "Too many password reset attempts. Try again later."
});

authRouter.post("/tokens", generateJWT);

authRouter.post("/resets", forgotPasswordLimiter, requestPasswordReset);

authRouter.post("/resets/:resetToken", resetPassword);

module.exports = authRouter;