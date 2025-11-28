const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { prisma, RoleType } = require("../prisma/prisma");
const NotFoundError = require("../utils/errors/notFoundError");
const ForbiddenError = require("../utils/errors/forbiddenError");
const BadRequestError = require("../utils/errors/badRequestError");

const SECRET_KEY = process.env.JWT_SECRET;

class UserService {
  static async register(utorid, name, email) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ utorid }, { email }],
      },
    });

    if (existingUser) {
      throw new Error();
    }

    const resetToken = jwt.sign({ utorid }, SECRET_KEY, { expiresIn: "7d" });

    const newUser = await prisma.user.create({
      data: {
        utorid,
        name,
        email,
        role: RoleType.regular,
        resetToken,
      },
      select: {
        id: true,
        utorid: true,
        name: true,
        email: true,
        verified: true,
        resetToken: true,
      },
    });

    return {
      ...newUser,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  static async getFilteredUsers(name, role, verified, activated, page, limit) {
    const filterOptions = {};

    if (name) {
      filterOptions.OR = [{ name }, { utorid: name }];
    }

    if (role) {
      filterOptions.role = role;
    }

    if (verified) {
      filterOptions.verified = verified === "true";
    }

    if (activated === "true") {
      filterOptions.NOT = { lastLogin: null };
    } else if (activated === "false") {
      filterOptions.lastLogin = null;
    }

    const [count, results] = await prisma.$transaction([
      prisma.user.count({ where: filterOptions }),
      prisma.user.findMany({
        where: filterOptions,
        take: limit,
        skip: (page - 1) * limit,
        select: {
          id: true,
          utorid: true,
          name: true,
          email: true,
          birthday: true,
          role: true,
          points: true,
          createdAt: true,
          suspicious: true,
        },
      }),
    ]);

    return { count, results };
  }

  static async getSpecificUser(userId, role) {
    // Base data to fetch (i.e cashier)
    const selectData = {
      id: true,
      utorid: true,
      name: true,
      points: true,
      verified: true,
      promotions: true,
      organizedEvents: true,
      suspicious: true,
    };

    if (role === RoleType.manager || role === RoleType.superuser) {
      selectData.email = true;
      selectData.birthday = true;
      selectData.role = true;
      selectData.createdAt = true;
      selectData.lastLogin = true;
      selectData.avatarUrl = true;
      selectData.isEventOrganizer = true;
    }

    const userData = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: selectData,
    });
    return userData;
  }

  static async queryForUser(userId, dataFields) {
    const userData = await prisma.user.findUnique({
      where: {
        id: userId,
        ...dataFields,
      },
    });

    if (!userData) {
      throw new NotFoundError("User not found");
    }

    return userData;
  }

  static async updateUserData(userId, updateFields) {
    const selectFields = {
      id: true,
      utorid: true,
      name: true,
    };
    for (const key of Object.keys(updateFields)) {
      selectFields[key] = true;
    }
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateFields,
      select: selectFields,
    });
    return updatedUser;
  }

  static async updateMyUserInfo(userId, name, email, birthday, avatar) {
    const fieldsToUpdate = {};

    if (name) fieldsToUpdate.name = name;
    if (email) fieldsToUpdate.email = email;
    if (birthday) fieldsToUpdate.birthday = birthday;
    if (avatar) fieldsToUpdate.avatarUrl = avatar.filename;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundError("user not found");

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: fieldsToUpdate,
      select: {
        id: true,
        utorid: true,
        name: true,
        email: true,
        birthday: true,
        role: true,
        points: true,
        createdAt: true,
        lastLogin: true,
        verified: true,
        avatarUrl: true,
      },
    });

    return updatedUser;
  }

  static async getMyUserInfo(userId) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        utorid: true,
        name: true,
        email: true,
        birthday: true,
        role: true,
        points: true,
        createdAt: true,
        lastLogin: true,
        verified: true,
        avatarUrl: true,
        promotions: true,
        isEventOrganizer: true,
        organizedEvents: true,
      },
    });

    if (!user) throw new NotFoundError("User not found");

    return user;
  }

  static async updateMyUserPassword(userId, oldPassword, newPassword) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundError("User not found");

    const { password } = user;
    if (password && !(await bcrypt.compare(oldPassword, password)))
      throw new ForbiddenError("Incorrect old password");

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/;
    if (!passwordRegex.test(newPassword))
      throw new BadRequestError("Invalid password format");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });
  }
}

module.exports = { UserService };
