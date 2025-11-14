const express = require('express');
const { generateJWT, resetPassword, requestPasswordReset } = require('../controllers/authController');

const authRouter = express.Router();

authRouter.post("/tokens", generateJWT);

authRouter.post("/resets", requestPasswordReset);

authRouter.post("/resets/:resetToken", resetPassword);

module.exports = authRouter;