const { AuthService } = require("../services/authService");
const jwt = require("jsonwebtoken");

async function generateJWT(req, res) {
  const { utorid, password } = req.body;

  if (
    !utorid ||
    !password ||
    typeof utorid !== "string" ||
    typeof password !== "string"
  ) {
    return res
      .status(400)
      .json({ error: "Bad Request: Missing utorid or password" });
  }

  try {
    const { token, expiresAt } = await AuthService.generateJWT(utorid, password);
    
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    });

    return res.status(200).json({
      message: 'Login successful',
      expiresAt
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
}

async function resetPassword(req, res) {
  const key = req.params.resetToken;

  try {
    jwt.verify(key, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError" || error.message === "jwt expired") {
      return res.status(410).send("Token has expired");
    }
    return res.status(404).send("Token verification failed");
  }

  const { email, password } = req.body;
  if (
    !email ||
    !password ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return res
      .status(400)
      .json({ error: "Bad Request: Missing email or password" });
  }

  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,20}$/;
  if (!regex.test(password)) {
    return res
      .status(400)
      .json({ error: "Bad Request: Invalid password format" });
  }

  try {
    await AuthService.resetPassword(email, key, password);
    res.status(200).send("Success");
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
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

async function logout(req, res) {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/'
  });
  res.clearCookie('x-csrf-token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'strict',
    path: '/'
  });
  
  return res.status(200).json({ message: 'Logged out successfully' });
}

module.exports = { generateJWT, resetPassword, requestPasswordReset, logout };
