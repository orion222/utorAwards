const { prisma, PromotionType, RoleType } = require("../prisma/prisma");
const NotFoundError = require("../utils/errors/notFoundError");
const BadRequestError = require("../utils/errors/badRequestError");
const ForbiddenError = require("../utils/errors/forbiddenError");

class PromotionService {
  static async createPromotion(
    name,
    description,
    type,
    startTime,
    endTime,
    minSpending,
    rate,
    points,
    utorid,
  ) {
    const creator = await prisma.user.findUnique({
      where: { utorid: utorid },
    });

    if (!creator)
      throw NotFoundError("Not Found: User not found to create promotion");

    return await prisma.promotion.create({
      data: {
        type:
          type === "automatic"
            ? PromotionType.automatic
            : PromotionType.onetime,
        name: name,
        description: description,
        rate: rate ? rate : null,
        minSpending: minSpending ? minSpending : null,
        points: points ? points : null,
        startTime: startTime,
        endTime: endTime,
        createdBy: { connect: { id: creator.id } },
      },
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        rate: true,
        minSpending: true,
        points: true,
        startTime: true,
        endTime: true,
      },
    });
  }

  static async retrievePromotions(
    userId,
    role,
    search,
    name,
    type,
    page,
    limit,
    started,
    ended,
  ) {
    const where = {};

    where.AND = [];
    let tempFilterDetail = { OR: [] };    

    if (search) {
      tempFilterDetail.OR.push({ name: { contains: search }});
      tempFilterDetail.OR.push({ description: { contains: search }});
    }

    if (name) {
      tempFilterDetail.OR.push({ name: name });
    }

    if (tempFilterDetail.OR.length !== 0) {
      where.AND.push(tempFilterDetail);
    }

    tempFilterDetail = { OR: [] };

    if (type) {
      where.type = type;
    }

    if (role === RoleType.regular || role === RoleType.cashier) {
      const now = new Date();
      if (typeof started === "boolean" && started) {
        where.startTime = { lt: now };
      } else {
        where.startTime = { gte: now };
      }

      if (typeof ended === "boolean" && ended) {
        where.endTime = { lt: now };
      } else {
        where.endTime = { gte: now };
      }
    }

    const take = limit;
    const skip = (page - 1) * limit;

    if (role === RoleType.regular || role === RoleType.cashier) {
      const select = {
        id: true,
        name: true,
        type: true,
        endTime: true,
        minSpending: true,
        rate: true,
        points: true,
      };
      where.NOT = {
        users: {
          some: { id: userId },
        },
      };
      const [count, results] = await prisma.$transaction([
        prisma.promotion.count({ where }),
        prisma.promotion.findMany({ where, skip, take, select }),
      ]);

      return { count, results };
    }

    const select = {
      id: true,
      name: true,
      type: true,
      startTime: true,
      endTime: true,
      minSpending: true,
      rate: true,
      points: true,
    };

    const [count, results] = await prisma.$transaction([
      prisma.promotion.count({ where }),
      prisma.promotion.findMany({ where, skip, take, select, orderBy: { startTime: "asc" } }),
    ]);

    return { count, results };
  }

  static async retrieveSinglePromotion(role, promotionId) {
    const promotion = await prisma.promotion.findUnique({
      where: {
        id: promotionId,
      },
    });

    if (!promotion) {
      throw new NotFoundError(`Promotion with id ${promotionId} not found`);
    }

    if (role === RoleType.regular || role === RoleType.cashier) {
      const currentTime = new Date();

      if (
        promotion.startTime > currentTime ||
        promotion.endTime < currentTime
      ) {
        throw new NotFoundError(
          `Promotion with id ${promotionId} has already started or ended`,
        );
      }
    }

    if (role === RoleType.manager || role === RoleType.superuser) {
      return {
        id: promotion.id,
        name: promotion.name,
        description: promotion.description,
        type: promotion.type,
        startTime: promotion.startTime,
        endTime: promotion.endTime,
        minSpending: promotion.minSpending,
        rate: promotion.rate ? promotion.rate : null,
        points: promotion.points ? promotion.points : null,
      };
    }

    return {
      id: promotion.id,
      name: promotion.name,
      description: promotion.description,
      type: promotion.type,
      endTime: promotion.endTime,
      minSpending: promotion.minSpending,
      rate: promotion.rate ? promotion.rate : null,
      points: promotion.points ? promotion.points : null,
    };
  }

  static async updateSinglePromotion(
    promotionId,
    name,
    description,
    type,
    startTime,
    endTime,
    minSpending,
    rate,
    points,
  ) {
    // default select fields
    const selectFields = {
      id: true,
      name: true,
      type: true,
    };

    const updateFields = {};

    if (name) {
      updateFields.name = name;
    }
    if (description) {
      selectFields.description = true;
      updateFields.description = description;
    }
    if (type) {
      updateFields.type = type;
    }
    if (startTime) {
      selectFields.startTime = true;
      updateFields.startTime = startTime;
    }
    if (endTime) {
      selectFields.endTime = true;
      updateFields.endTime = endTime;
    }
    if (minSpending) {
      selectFields.minSpending = true;
      updateFields.minSpending = minSpending;
    }
    if (rate) {
      selectFields.rate = true;
      updateFields.rate = rate;
    }
    if (points) {
      selectFields.points = true;
      updateFields.points = points;
    }

    const promotion = await prisma.promotion.findUnique({
      where: {
        id: promotionId,
      },
    });

    if (!promotion) {
      throw new NotFoundError(`Promotion with id ${promotionId} not found`);
    }
    if (endTime && new Date(endTime) <= promotion.startTime) {
      throw new BadRequestError("endTime must be after startTime");
    }

    const currentTime = new Date();
    if (
      (name ||
        description ||
        type ||
        startTime ||
        minSpending ||
        rate ||
        points) &&
      currentTime > promotion.startTime
    ) {
      throw new ForbiddenError(
        "Cannot update a promotion that has already started",
      );
    }
    if (endTime && currentTime > promotion.endTime) {
      throw new ForbiddenError(
        "Cannot update a promotion that has already ended",
      );
    }

    const updatedPromotion = await prisma.promotion.update({
      where: {
        id: promotionId,
      },
      data: updateFields,
      select: selectFields,
    });

    return updatedPromotion;
  }

  static async deleteSinglePromotion(promotionId) {
    const promotion = await prisma.promotion.findUnique({
      where: {
        id: promotionId,
      },
    });

    if (!promotion) {
      throw new NotFoundError(`Promotion with id ${promotionId} not found`);
    }

    const currentTime = new Date();
    if (currentTime >= promotion.startTime) {
      throw new ForbiddenError(
        "Cannot delete a promotion that has already started",
      );
    }

    await prisma.promotion.delete({
      where: {
        id: promotionId,
      },
    });
  }

}

module.exports = { PromotionService };
