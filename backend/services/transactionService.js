const { prisma, TransactionType, RoleType } = require("../prisma/prisma");
const NotFoundError = require("../utils/errors/notFoundError");
const BadRequestError = require("../utils/errors/badRequestError");
const {
  promoToPoints,
  pointsConversion,
} = require("../utils/transactionHelpers");
const ForbiddenError = require("../utils/errors/forbiddenError");

class TransactionService {
  static async createPurchase(
    creatorUtorid,
    targetUtorid,
    type,
    spent,
    promotionIds,
    remark,
  ) {
    const creator = await prisma.user.findUnique({
      where: {
        utorid: creatorUtorid,
      },
    });

    if (!creator)
      throw new NotFoundError(
        `User with given utorid ${creatorUtorid} does not exist`,
      );

    const targetUser = await prisma.user.findUnique({
      where: {
        utorid: targetUtorid,
      },
      include: {
        promotions: true,
      },
    });

    if (!targetUser)
      throw new NotFoundError(
        `User with given utorid ${targetUtorid} does not exist`,
      );

    const activePromo = await this.checkPromoIds(
      targetUser,
      spent,
      promotionIds,
    );
    const totalPromoPoints = promoToPoints(spent, activePromo);

    const data = {
      type: type,
      user: { connect: { id: creator.id } },
      spent,
      amount: pointsConversion(spent) + totalPromoPoints,
      targetUser: { connect: { id: targetUser.id } },
      remark: remark,
      suspicious: creator.suspicious,
    };

    if (promotionIds.length > 0) {
      data.promotions = { connect: promotionIds.map((id) => ({ id })) };
    }

    const select = {
      id: true,
      targetUser: true,
      type: true,
      spent: true,
      amount: true,
      relatedId: true,
      remark: true,
      user: true,
      promotions: true,
      suspicious: true,
    };

    // count promotions used by this transaction for target user
    await prisma.user.update({
      where: {
        id: targetUser.id,
      },
      data: {
        promotions: { connect: promotionIds.map((id) => ({ id })) },
      },
    });

    const newTransaction = await prisma.transaction.create({
      data,
      select,
    });

    return newTransaction;
  }

  static async createAdjustment(
    creatorUtorid,
    targetUtorid,
    type,
    amount,
    relatedId,
    promotionIds,
    remark,
  ) {
    const adjustedTransaction = await prisma.transaction.findUnique({
      where: {
        id: relatedId,
      },
    });

    if (!adjustedTransaction)
      throw new NotFoundError(
        `Transaction with given transaction id ${relatedId} does not exist`,
      );

    const creator = await prisma.user.findUnique({
      where: {
        utorid: creatorUtorid,
      },
    });

    if (!creator)
      throw new NotFoundError(
        `User with given utorid ${creatorUtorid} does not exist`,
      );

    const targetUser = await prisma.user.findUnique({
      where: {
        utorid: targetUtorid,
      },
    });

    if (!targetUser)
      throw new NotFoundError(
        `User with given utorid ${targetUtorid} does not exist`,
      );

    const newTransaction = await prisma.transaction.create({
      data: {
        type: type,
        userId: creator.id,
        spent: 0, //This could become an error so it is only temporary
        amount,
        promotions: { connect: promotionIds.map((id) => ({ id })) },
        targetUserId: targetUser.id,
        remark: remark,
        relatedId: relatedId,
      },
      select: {
        id: true,
        targetUser: { select: { utorid: true } },
        type: true,
        spent: true,
        amount: true,
        relatedId: true,
        remark: true,
        user: { select: { utorid: true } },
        promotions: { select: { id: true } },
      },
    });

    // count promotions used by this transaction for target user
    await prisma.user.update({
      where: {
        id: targetUser.id,
      },
      data: {
        promotions: { connect: promotionIds.map((id) => ({ id })) },
      },
    });

    return newTransaction;
  }

  static async createRedemption(utorid, amount, remark) {
    const creator = await prisma.user.findUnique({
      where: {
        utorid: utorid,
      },
    });

    if (!creator) {
      throw new NotFoundError(
        `User with given utorid ${utorid} does not exist`,
      );
    }

    if (creator.points < amount) {
      throw new BadRequestError(
        `Request amount (${amount}) exceed the user's point balance (${creator.points})`,
      );
    }

    const creatorId = creator.id;

    const dataFields = {
      type: "redemption",
      user: { connect: { id: creatorId } },
      spent: 0,
      amount,
      targetUser: { connect: { id: creatorId } },
      remark: remark ?? "",
    };

    const newTransaction = await prisma.transaction.create({
      data: dataFields,
      select: {
        id: true,
        user: { select: { utorid: true } },
        targetUser: { select: { utorid: true } },
        type: true,
        processedByUser: { select: { utorid: true } },
        amount: true,
        remark: true,
        createdAt: true,
      },
    });

    return newTransaction;
  }

  static async deleteRedemption(id) {
    const newTransaction = await prisma.transaction.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id,
      },
      select: {
        id: true,
      },
    });
    return newTransaction;
  }

  static async createTransfer(senderId, recipientId, amount, remark) {
    const transferTransactions = await prisma.$transaction(async (tx) => {
      const sender = await tx.user.findUnique({
        where: {
          id: senderId,
        },
      });

      const recipient = await tx.user.findUnique({
        where: {
          id: recipientId,
        },
      });

      if (!sender || !recipient)
        throw new BadRequestError(
          `Bad Request: User with given userId ${senderId ? recipientId : senderId} does not exist`,
        );

      if (sender.points < amount)
        throw new BadRequestError(
          `Bad Request: Insufficient points (${sender.points}) for transfer (${amount})`,
        );

      if (!sender.verified)
        throw new ForbiddenError(
          "Forbidden: Sender is not verified to make transfer",
        );

      const senderTransaction = await tx.transaction.create({
        data: {
          type: TransactionType.transfer,
          user: { connect: { id: senderId } },
          spent: 0,
          amount: -amount,
          targetUser: { connect: { id: recipientId } },
          relatedId: recipientId,
          remark,
        },
        include: {
          user: true,
          targetUser: true,
        },
      });

      const recipientTransaction = await tx.transaction.create({
        data: {
          type: TransactionType.transfer,
          user: { connect: { id: recipientId } },
          spent: 0,
          amount,
          targetUser: { connect: { id: senderId } },
          relatedId: senderId,
          remark,
        },
        include: {
          user: true,
          targetUser: true,
        },
      });

      await tx.user.update({
        where: {
          id: senderId,
        },
        data: {
          points: {
            decrement: amount,
          },
        },
      });

      await tx.user.update({
        where: {
          id: recipientId,
        },
        data: {
          points: {
            increment: amount,
          },
          grossPoints: {
            increment: amount,
          },
        },
      });

      return { senderTransaction, recipientTransaction };
    });

    return transferTransactions;
  }

  static async createEvent(
    creatorUtorid,
    recipientUtorid,
    type,
    amount,
    eventId,
  ) {
    return await prisma.$transaction(async (prisma) => {
      const creator = await prisma.user.findUnique({
        where: {
          utorid: creatorUtorid,
        },
      });

      let recipient;
      if (recipientUtorid) {
        recipient = await prisma.user.findUnique({
          where: {
            utorid: recipientUtorid,
          },
        });
        if (!recipient)
          throw new NotFoundError(
            "Not Found: Recipient not found for creating event",
          );
      }

      if (!creator)
        throw new NotFoundError("Not Found: Creator not found to create event");

      const event = await prisma.event.findUnique({
        where: {
          id: eventId,
        },
        include: {
          organizers: true,
        },
      });

      if (!event)
        throw new NotFoundError(
          `Not Found: Event with given eventId ${eventId} does not exist`,
        );

      const rsvps = await prisma.rsvp.findMany({
        where: { eventId: eventId },
        select: { userId: true },
      });
      if (
        recipientUtorid &&
        !rsvps.some((guest) => guest.userId === recipient.id)
      ) {
        throw new BadRequestError(
          "Bad Request: Recipient is not on guest list",
        );
      }

      const isAnOrganizer = event.organizers.some(
        (org) => org.id === creator.id,
      );
      if (
        creator.role !== RoleType.manager &&
        creator.role !== RoleType.superuser &&
        !isAnOrganizer
      ) {
        throw new ForbiddenError(
          "Forbidden: Creator does not have correct clearance",
        );
      }

      const queryArgs = (user) => {
        return {
          data: {
            type: type,
            user: { connect: { id: creator.id } },
            spent: 0,
            amount: amount,
            targetUser: { connect: { id: user.id } },
            relatedId: event.id,
            remark: event.name,
          },
          select: {
            id: true,
            amount: true,
            relatedId: true,
            remark: true,
            user: { select: { utorid: true } },
            targetUser: { select: { utorid: true } },
          },
        };
      };

      if (!recipientUtorid) {
        // If not given, amount awarded to all GUESTS
        if (Math.floor(event.pointsRemain / event.numGuests) < amount) {
          throw new BadRequestError(
            `Bad Request: Insufficient points (${event.pointsRemain}) in event to award all guests (${event.numGuests})`,
          );
        }

        const rsvps = await prisma.rsvp.findMany({
          where: {
            eventId: eventId,
          },
          select: {
            userId: true,
          },
        });

        let response = [];
        for (let i = 0; i < rsvps.length; i++) {
          const tempUser = await prisma.user.findUnique({
            where: { id: rsvps[i].userId },
          });
          const tempTransaction = await prisma.transaction.create(
            queryArgs(tempUser),
          );

          await prisma.event.update({
            where: { id: eventId },
            data: {
              pointsAwarded: {
                increment: amount,
              },
              pointsRemain: {
                decrement: amount,
              },
            },
          });

          await prisma.user.update({
            where: {
              id: rsvps[i].userId,
            },
            data: {
              points: {
                increment: amount,
              },
              grossPoints: {
                increment: amount,
              },
            },
          });
          response.push({
            id: tempTransaction.id,
            recipient: tempTransaction.targetUser.utorid,
            awarded: tempTransaction.amount,
            type: "event",
            relatedId: tempTransaction.relatedId,
            remark: tempTransaction.remark,
            createdBy: creatorUtorid,
          });
        }

        return response;
      }

      if (Math.floor(event.pointsRemain < amount)) {
        throw new BadRequestError(
          `Bad Request: Insufficient points (${event.pointsRemain}) in event to award to guest (${recipient.utorid})`,
        );
      }

      const transaction = await prisma.transaction.create(queryArgs(recipient));
      await prisma.event.update({
        where: { id: eventId },
        data: {
          pointsAwarded: {
            increment: amount,
          },
          pointsRemain: {
            decrement: amount,
          },
        },
      });
      await prisma.user.update({
        where: {
          utorid: recipientUtorid,
        },
        data: {
          points: {
            increment: amount,
          },
          grossPoints: {
            increment: amount,
          },
        },
      });
      return {
        id: transaction.id,
        recipient: transaction.targetUser.utorid,
        awarded: transaction.amount,
        type: "event",
        relatedId: transaction.relatedId,
        remark: transaction.remark,
        createdBy: creatorUtorid,
      };
    });
  }

  static async retrieveTransactions(
    name,
    remark,
    createdBy,
    suspicious,
    promotionId,
    type,
    relatedId,
    amount,
    operator,
    page,
    limit,
    orderBy,
  ) {
    const where = {};

    if (name) {
      where.OR = [
        { targetUser: { is: { utorid: name } } },
        { targetUser: { is: { name } } },
      ];
    }

    if (remark) {
      where.remark = { contains: remark };
    }

    const userFilter = {};
    if (createdBy) userFilter.utorid = { contains: createdBy };
    if (typeof suspicious === "boolean") userFilter.suspicious = suspicious;
    if (Object.keys(userFilter).length > 0) {
      where.user = { is: userFilter };
    }

    if (promotionId) {
      where.promotions = { some: { id: promotionId } };
    }

    if (type) {
      where.type = type;
      if (relatedId) where.relatedId = relatedId;
    }

    if (operator && (amount || amount === 0)) {
      where.amount = { [operator]: amount };
    }

    const take = limit;
    const skip = (page - 1) * take;
    const [count, queryResults] = await prisma.$transaction([
      prisma.transaction.count({ where }),
      prisma.transaction.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          type: true,
          spent: true,
          amount: true,
          promotions: {
            select: {
              id: true,
            }
          },
          user: {
            select: {
              utorid: true,
              name: true,
            }
          },
          targetUser: {
            select: {
              utorid: true,
              name: true,
            }
          },
          suspicious: true,
          remark: true,
          relatedId: true,
        },
        orderBy: orderBy ? orderBy : { createdAt: "asc" },
      }),
    ]);

    return [count, queryResults];
  }

  static async retrieveUserTransactions(userId, type, remark, relatedId, promotionId, amount, operator, page = 1, limit = 10, orderBy) {
    const whereFields = {};

    if (!userId) throw new BadRequestError("Must include user id");
    whereFields.OR = [
      { userId: userId },
      { targetUserId: userId }
    ];

    if ((!type && relatedId) || (!amount && operator)) throw new BadRequestError("Dependent fields not fulfilled");

    if (type) whereFields.type = type;
    if (remark) whereFields.remark = { contains: remark };
    if (relatedId) whereFields.relatedId = relatedId;
    if (promotionId) whereFields.promotions = { some: { id: promotionId } };

    if (amount && operator) whereFields.amount = { [operator]: amount };
    else if (amount && !operator) whereFields.amount = amount;

    const [count, results] = await prisma.$transaction([
        prisma.transaction.count({ where: whereFields }),
        prisma.transaction.findMany({
          where: whereFields,
          select: {
            id: true,
            type: true,
            spent: true,
            amount: true,
            promotions: {
              select: {
                id: true,
              }
            },
            user: {
              select: {
                utorid: true
              }
            },
            targetUser: {
              select: {
                utorid: true
              }
            },
            suspicious: true,
            remark: true,
            relatedId: true,
            createdAt: true,
          },
          take: limit,
          skip: (page - 1) * limit,
          orderBy: orderBy ? orderBy : {},
        })
    ]);

    return [count, results];
  }

  static async updatePoints(transaction) {
    const targetUser = await prisma.user.findUnique({
      where: {
        utorid: transaction.targetUser.utorid,
      },
    });

    const amount = transaction.amount;

    if (!Number.isInteger(amount))
      throw new BadRequestError(`Invalid format of points: ${amount}`);

    const allowUpdate =
      !transaction.suspicious || transaction.type === "adjustment";

    if (allowUpdate) {
      const updatedUser = await prisma.user.update({
        where: {
          id: targetUser.id,
        },
        data: {
          points: {
            increment: amount,
          },
          grossPoints: {
            increment: amount,
          },
        },
      });

      if (!updatedUser)
        throw new BadRequestError(
          `Failed to update points for user with id ${targetUser.id}`,
        );
    }

    return allowUpdate;
  }

  static async checkPromoIds(targetUser, spent, promotionIds) {
    // search for any one-time promotions already used by target user
    const usedPromo = targetUser.promotions.filter(
      (promo) => promo.type === "onetime",
    );
    if (usedPromo.length > 0) {
      const usedPromoIds = usedPromo.map((promo) => promo.id);
      const overlap = promotionIds.some((id) => usedPromoIds.includes(id));
      if (overlap) {
        throw new BadRequestError(
          `Bad Request: User has already used one-time promotion(s)`,
        );
      }
    }

    // Check if each given promo id is valid
    // const isUsed = targetUser.promotions ? promotionIds.every(promo => targetUser.promotions.includes(promo)): false; //Already redeemed?
    const now = new Date();
    const activePromo = await prisma.promotion.findMany({
      where: {
        id: { in: promotionIds },
        startTime: { lte: now },
        endTime: { gt: now },
      },
    });
    const isExpired = activePromo.length !== promotionIds.length;

    if (isExpired) {
      throw new BadRequestError(
        `Bad Request: One or more promotions are either expired or already redeemed by user`,
      );
    }

    // Check if each given promo id meets min spending
    const notMeetMin = activePromo.some(
      (promo) => promo.minSpending && spent < promo.minSpending,
    );

    if (notMeetMin) {
      throw new BadRequestError(
        `Bad Request: One or more promotions do not meet minimum spending requirement`,
      );
    }

    return activePromo;
  }

  static async retrieveSingleTransaction(transactionId, role, userId) {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: transactionId,
      },
      select: {
        id: true,
        type: true,
        spent: true,
        amount: true,
        promotions: true,
        suspicious: true,
        remark: true,
        user: {
          select: {
            name: true,
            utorid: true,
            avatarUrl: true, 
          }
        },
        targetUser: {
          select: {
            name: true,
            utorid: true,
            avatarUrl: true, 
          }
        },
        relatedId: true,
        createdAt: true,
        processed: true,
        processedByUser: {
          select: {
            name: true,
            utorid: true,
            avatarUrl: true,            
          }
        }
      },
    });

    if (!transaction) {
      throw new NotFoundError();
    }

    if (transaction.type === TransactionType.transfer && role === RoleType.regular && transaction.user.id !== userId && transaction.targetUser.id !== userId) {
      throw new ForbiddenError("Forbidden: Insufficient clearance to access this transaction");
    }

    if ((transaction.type === TransactionType.purchase || transaction.type === TransactionType.adjustment) && role === RoleType.regular && transaction.targetUser.id !== userId) {
      throw new ForbiddenError("Forbidden: Insufficient clearance to access this transaction");
    }

    if (transaction.type === TransactionType.redemption && role === RoleType.regular && transaction.user.id !== userId) {
      throw new ForbiddenError("Forbidden: Insufficient clearance to access this transaction");
    }

    const query = {
      id: transaction.id,
      utorid: transaction.targetUser?.utorid,
      type: transaction.type,
      spent: transaction.spent,
      amount: transaction.amount,
      promotions: transaction.promotions,
      createdAt: transaction.createdAt,
      remark: transaction.remark,
      createdBy: transaction.user?.utorid,
      relatedId: transaction.relatedId,
      suspicious: transaction.suspicious,
      processed: transaction.processed,
      user: transaction.user,
      targetUser: transaction.targetUser,
    }

    return transaction.processed ? {
      ...query, processedBy: transaction.processedByUser?.utorid ?? null
    } : query;
  }

  static async updateTransactionSuspicion(transactionId, isNowSuspicious) {
    const transactionDetails = await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.findUnique({
        where: {
          id: transactionId,
        },
        include: {
          targetUser: true,
        },
      });

      if (!transaction) throw new NotFoundError();
      if (!transaction.targetUser)
        throw new NotFoundError("No user associated with this transaction");

      const { suspicious: wasSuspicious } = transaction;

      const newTransaction = await tx.transaction.update({
        where: {
          id: transactionId,
        },
        data: {
          suspicious: isNowSuspicious,
        },
        select: {
          id: true,
          targetUserId: true,
          type: true,
          spent: true,
          amount: true,
          promotions: true,
          suspicious: true,
          remark: true,
          user: true,
          targetUser: true,
        },
      });

      const { targetUser, amount } = transaction;
      let newAmount = targetUser.points;

      // going from true -> false
      if (wasSuspicious && !isNowSuspicious) newAmount += amount;

      // going from false -> true
      if (!wasSuspicious && isNowSuspicious) newAmount -= amount;

      if (wasSuspicious !== isNowSuspicious) {
        const { targetUserId } = transaction;

        await tx.user.update({
          where: {
            id: targetUserId,
          },
          data: {
            points: newAmount,
          },
        });
      }

      return newTransaction;
    });

    return {
      id: transactionDetails.id,
      utorid: transactionDetails.targetUser.utorid,
      type: transactionDetails.type,
      spent: transactionDetails.spent,
      amount: transactionDetails.amount,
      promotionIds:
        transactionDetails.promotions.map((promotion) => promotion.id) ?? [],
      suspicious: transactionDetails.suspicious,
      remark: transactionDetails.remark,
      createdBy: transactionDetails.user.utorid,
    };
  }

  static async updateTransactionProcessed(processedById, transactionId) {
    const transactionDetails = await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.findUnique({
        where: {
          id: transactionId,
        },
        include: {
          targetUser: true,
        },
      });

      if (!transaction)
        throw new NotFoundError("Not Found: Transaction does not exist");
      if (!transaction.targetUser)
        throw new NotFoundError(
          "Not Found: No user associated with this transaction",
        );

      const { processed, type } = transaction;

      if (type !== "redemption")
        throw new BadRequestError("Bad Request: Invalid transaction type");

      if (processed) {
        throw new BadRequestError(
          "Bad Request: Transaction has already been processed",
        );
      }

      const { amount, targetUser, targetUserId } = transaction;
      const { points } = targetUser;
      const newPointsBalance = points - amount;

      await tx.user.update({
        where: {
          id: targetUserId,
        },
        data: {
          points: newPointsBalance,
        },
      });

      const newTransaction = await tx.transaction.update({
        where: {
          id: transactionId,
        },
        data: {
          processed: true,
          processedById,
        },
        include: {
          user: true,
          targetUser: true,
          processedByUser: true,
        },
      });

      return newTransaction;
    });

    const {
      id,
      type,
      amount: redeemed,
      remark,
      user,
      targetUser,
      processedByUser,
    } = transactionDetails;
    const { utorid } = targetUser;
    const { utorid: createdBy } = user;
    const { utorid: processedBy } = processedByUser;

    return {
      id,
      utorid,
      type,
      processedBy,
      redeemed,
      remark,
      createdBy,
    };
  }
}

module.exports = { TransactionService };
