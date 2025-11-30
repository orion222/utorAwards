const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { prisma, RoleType } = require("../prisma/prisma");
const NotFoundError = require("../utils/errors/notFoundError");
const ForbiddenError = require("../utils/errors/forbiddenError");
const BadRequestError = require("../utils/errors/badRequestError");
const { generateFakeName } = require("../utils/userHelpers");

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

  static async getFilteredUsers(
    userId,
    search,
    name,
    role,
    verified,
    activated,
    page,
    limit,
    orderBy,
    eventId,
    is_guest = false,
    is_organizer = false,
  ) {
    const filterOptions = {};

    if (search) {
      filterOptions.AND = [
        {
          OR: [
            { name: { contains: search } },
            { utorid: { contains: search } },
            { email: { contains: search } },
          ],
        },
      ];
    }

    if (name) {
      filterOptions.OR = [{ name }, { utorid: name }];
    }

    if (role) {
      filterOptions.role = role;
    }

    if (verified === "true") {
      filterOptions.verified = true;
    }
    else if (verified === "false") {
      filterOptions.verified = false;
    }

    if (activated === "true") {
      filterOptions.NOT = { lastLogin: null };
    } 
    else if (activated === "false") {
      filterOptions.lastLogin = null;
    }

    if (eventId) {
      const event = await prisma.event.findUnique({
        where: { id: parseInt(eventId, 10) },
        include: {
          organizers: {
            select: { id: true },
          },
          rsvps: {
            select: { userId: true },
          },
        },
      });

      if (event) {
        const organizerIds = new Set(event.organizers.map((org) => org.id));
        const guestIds = new Set(event.rsvps.map((rsvp) => rsvp.userId));
        let eventFilter = {};
        if (is_organizer && is_guest) {
          // User wants both organizers AND guests
          eventFilter = {
            OR: [
              { id: { in: Array.from(organizerIds) } },
              { id: { in: Array.from(guestIds) } },
            ],
          };
        } else if (is_organizer) {
          // User wants only organizers
          eventFilter = { id: { in: Array.from(organizerIds) } };
        } else if (is_guest) {
          // User wants only guests
          eventFilter = { id: { in: Array.from(guestIds) } };
        } else {
          // User wants neither organizers nor guests (users not associated with the event)
          eventFilter = {
            AND: [
              { id: { notIn: Array.from(organizerIds) } },
              { id: { notIn: Array.from(guestIds) } },
            ],
          };
        }

        if (!filterOptions.AND) {
          filterOptions.AND = [];
        }
        filterOptions.AND.push(eventFilter);
      } else {
        return { count: 0, results: [] };
      }
    }
    let whereClause = {
      ...filterOptions,
    };
    if (!is_organizer) {
      whereClause.NOT = {
        ...whereClause.NOT,
        id: userId,
      };
    }

    console.log(whereClause);
    let [count, results] = await prisma.$transaction([
      prisma.user.count({ where: whereClause }),
      prisma.user.findMany({
        where: whereClause,
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
        orderBy: orderBy ? orderBy : { id: "asc" },
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

  static async updateMyUserInfo(
    userId,
    name,
    email,
    birthday,
    avatar,
    hideUtorid,
  ) {
    const fieldsToUpdate = {};

    if (name) fieldsToUpdate.name = name;
    if (email) fieldsToUpdate.email = email;
    if (birthday) fieldsToUpdate.birthday = birthday;
    if (avatar) fieldsToUpdate.avatarUrl = avatar.filename;
    if (hideUtorid !== undefined) fieldsToUpdate.hideUtorid = hideUtorid;

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
        hideUtorid: true,
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
        hideUtorid: true,
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

  static async getLeaderboard(search, name, role, verified, page, limit) {
    const filterOptions = {};

    if (search) {
      filterOptions.AND = [
        {
          OR: [
            { name: { contains: search } },
            { utorid: { contains: search } },
            { email: { contains: search } },
          ],
        },
      ];
    }

    if (name) {
        filterOptions.OR = [{ name }, { utorid: name }];
    }

    if (role) {
      filterOptions.role = role;
    }

    if (verified === "true") {
      filterOptions.verified = true;
    }
    else if (verified === "false") {
      filterOptions.verified = false;
    }

    const [count, results] = await prisma.$transaction([
      prisma.user.count({ where: filterOptions }),
      prisma.user.findMany({
        orderBy: {
          grossPoints: 'desc',
        },
        take: limit,
        skip: (page - 1) * limit,
        where: filterOptions,
        select: {
          id: true,
          utorid: true,
          name: true,
          points: true,
          grossPoints: true,
          hideUtorid: true,
        },
      }),
    ]);

    const globalRanks = await prisma.user.findMany({
      orderBy: { grossPoints: "desc" },
      select: { id: true, grossPoints: true },
    });

    const rankMap = new Map();
    globalRanks.forEach((user, index) => {
      rankMap.set(user.id, index + 1);
    });

    const transformedUsers = results.map(user => {
      if (user.hideUtorid) {
        return {
          ...user,
          utorid: generateFakeName(),
          rank: rankMap.get(user.id),
        };
      }
      return {
        ...user,
        rank: rankMap.get(user.id),
      };  
    });

    return { count, results: transformedUsers };
  }
}

module.exports = { UserService };
