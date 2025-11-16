const { prisma } = require("../prisma/prisma");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const NotFoundError = require("../utils/errors/notFoundError");
const BadRequestError = require("../utils/errors/badRequestError");
const UnauthorizedError = require("../utils/errors/unauthorizedError");
const TooManyRequestsError = require("../utils/errors/tooManyRequestsError");
const { sendResetPasswordEmail } = require("../utils/emailSender");
const SECRET_KEY = process.env.JWT_SECRET;

class AuthService {

  static async requestPasswordReset(email) {
    const resetDetails = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { email }
      });    
      
      if (!user) {
        throw new Error();
      }

      const resetToken = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });

      await tx.user.update({
        where: { email },
        data: { resetToken }
      });

      return {
        expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
        resetToken
      }
    });

    const { resetToken } = resetDetails;

    await sendResetPasswordEmail(email, resetToken);
  }

  static async resetPassword(utorid, resetToken, password) {
    const user = await prisma.user.findUnique({
      where: {
        utorid
      }
    });

    if (!user) throw new NotFoundError("User with given utorid");
    if (!user.resetToken) throw new UnauthorizedError("No reset token found for user");
    if (user.resetToken !== resetToken) throw new NotFoundError("Invalid reset token");

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {utorid: utorid},
        data: {password: hashedPassword}
      });

      // set resetToken to null
      await tx.user.update({
        where: {utorid: utorid},
        data: {resetToken: null}
      });
    });
  }

  static async generateJWT(utorid, password) {
    const userDetails = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: {
          utorid
        }
      });

      if (!user) throw new NotFoundError("User not found");
      if (!user.password) throw new UnauthorizedError("Password not set for user");
      if (!(await bcrypt.compare(password, user.password))) throw new UnauthorizedError("Invalid credentials");

      await tx.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() }
      });

      return user;
    });

    const payload = {
      id: userDetails.id,
      utorid: userDetails.utorid,
      role: userDetails.role,
    };

    return {
      token: jwt.sign(payload, SECRET_KEY, {expiresIn: '7d'}),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  }
}

module.exports = { AuthService };