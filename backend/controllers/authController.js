const { AuthService } = require('../services/authService');
const jwt = require('jsonwebtoken');

async function generateJWT(req, res) {
  const { utorid, password } = req.body;

  if (!utorid || !password || typeof utorid !== "string" || typeof password !== "string") {
    return res.status(400).json({error: "Bad Request: Missing utorid or password"});
  }

  try {
    const token = await AuthService.generateJWT(utorid, password);
    return res.status(200).json(token);
  } catch (error) {
    return res.status(error.statusCode || 500).json({error: error.message});
  }
}

async function resetPassword(req, res) {
  const key = req.params.resetToken;

  try {
    jwt.verify(key, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError' || error.message === "jwt expired") {
      return res.status(410).send("Token has expired");
    }
    return res.status(404).send('Token verification failed');
  }
  
  const { utorid, password } = req.body;
  if (!utorid || !password || typeof utorid !== "string" || typeof password !== "string") {
    return res.status(400).json({error: "Bad Request: Missing utorid or password"});
  }
  
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,20}$/;
  if (!regex.test(password)) {
    return res.status(400).json({error: "Bad Request: Invalid password format"});
  }

  try {
    await AuthService.resetPassword(utorid, key, password);
    res.status(200).send("Success");
  } catch (error) {
    res.status(error.statusCode || 500).json({error: error.message});
  }
}

async function requestPasswordReset(req, res) {
  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({error: "Bad Request: Empty email"});
  }

  try {
    await AuthService.requestPasswordReset(email);
    res.status(202).send();
  } catch (error) {
    res.status(202).send(); // Always return success for security purposes
  }
}

module.exports = { generateJWT, resetPassword, requestPasswordReset }