const express = require('express');
const { generateJWT, resetPassword, requestPasswordReset, logout } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth')
const rateLimit = require('express-rate-limit');
const { doubleCsrf } = require('csrf-csrf');
const cors = require('cors');

const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET,
    getSessionIdentifier: (req) => req.cookies.auth_token,
    cookieName: 'x-csrf-token',
    cookieOptions: {
        sameSite: isProduction ? 'none' : 'strict',
        secure: isProduction,
        httpOnly: true
    }
});

const authRouter = express.Router();

const forgotPasswordLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 1,
    message: "Too many password reset attempts. Try again later."
});

authRouter.post("/tokens", generateJWT);

authRouter.post("/logout", logout);

authRouter.get("/verify", verifyToken);

authRouter.post("/resets", forgotPasswordLimiter, requestPasswordReset);

authRouter.post("/resets/:resetToken", resetPassword);

authRouter.get('/csrf-token', (req, res) => {
    const token = generateCsrfToken(req, res);
    res.json({ token });
})

module.exports = authRouter;
module.exports.doubleCsrfProtection = doubleCsrfProtection;