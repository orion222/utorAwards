const { RoleType } = require("@prisma/client");
const { UserService } = require("../services/userService");
const { EventService } = require("../services/eventService");
const { TransactionService } = require("../services/transactionService");
const { PromotionService } = require("../services/promotionService");
const { isValidYYYYMMDD } = require("../utils/generalHelpers");
const { mapByTransactionType } = require("../utils/transactionHelpers");
const { validRetrieveBody } = require("../utils/userHelpers");

async function registerUser(req, res) {
  const { utorid, name, email } = req.body;

  if (!utorid || !name || !email) {
    return res.status(400).json({ error: "Bad Request" });
  }

  if (
    (utorid.length !== 7 && utorid.length !== 8) ||
    name.length < 1 ||
    name.length > 50 ||
    !email.endsWith("@mail.utoronto.ca")
  ) {
    return res.status(400).json({ error: "Bad Request" });
  }

  try {
    const userData = await UserService.register(utorid, name, email);
    res.status(201).json(userData);
  } catch (error) {
    res
      .status(409)
      .json({ error: "User with given utorid/email already exists" });
  }
}

async function getFilteredUsers(req, res) {
  const { name, role, verified, activated, page, limit } = req.query;

  if (verified && verified !== "true" && verified !== "false") {
    return res
      .status(400)
      .json({ error: "Bad Request: invalid verified value" });
  }
  if (activated && activated !== "true" && activated !== "false") {
    return res
      .status(400)
      .json({ error: "Bad Request: invalid activated value" });
  }
  if (
    page &&
    (!Number.isInteger(parseInt(page, 10)) || parseInt(page, 10) <= 0)
  ) {
    return res.status(400).json({ error: "Bad Request: invalid page value" });
  }
  if (
    limit &&
    (!Number.isInteger(parseInt(limit, 10)) || parseInt(limit, 10) <= 0)
  ) {
    return res.status(400).json({ error: "Bad Request: invalid limit value" });
  }

  const pageNum = page ? parseInt(page, 10) : 1;
  const limitNum = limit ? parseInt(limit, 10) : 10;
  if (pageNum < 1) {
    return res
      .status(400)
      .json({ error: "Bad Request: page must be at least 1" });
  }

  const filteredUsersData = await UserService.getFilteredUsers(
    name,
    role,
    verified,
    activated,
    pageNum,
    limitNum,
  );
  res.status(200).json(filteredUsersData);
}

async function getSpecificUser(req, res) {
  const userId = req.userId;
  const { role } = req.user;

  try {
    const specificUserData = await UserService.getSpecificUser(userId, role);
    if (!specificUserData) {
      res.status(404).json({ error: "Not Found: User not found" });
    } else {
      res.status(200).json(specificUserData);
    }
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
}

async function updateSpecificUser(req, res) {
  const userId = req.userId;
  const { email, verified, suspicious, role } = req.body;

  if (
    Object.keys(req.body).length === 0 ||
    (!email && verified === null && suspicious === null && !role)
  ) {
    return res
      .status(400)
      .json({ error: "Bad Request: at least one field is required" });
  }

  const updateFields = {};
  const userRole = req.user?.role;

  if (email) {
    if (typeof email !== "string" || !email.endsWith("@mail.utoronto.ca")) {
      return res
        .status(400)
        .json({ error: "Bad Request: invalid email format" });
    }
    updateFields.email = email;
  }

  if (verified !== undefined && verified !== null) {
    if (typeof verified !== "boolean") {
      return res
        .status(400)
        .json({ error: "Bad Request: verified must be a boolean" });
    }
    if (!verified) {
      return res
        .status(400)
        .json({ error: "Bad Request: cannot unverify a user" });
    }
    updateFields.verified = true;
  }

  if (suspicious !== undefined && suspicious !== null) {
    if (typeof suspicious !== "boolean") {
      return res
        .status(400)
        .json({ error: "Bad Request: suspicious must be a boolean" });
    }
    updateFields.suspicious = suspicious;
  }

  if (role) {
    try {
      switch (role) {
        case "regular":
          updateFields.role = RoleType.regular;
          break;

        case "cashier": {
          // Check if current user (id) is flagged as suspicious
          const userData = await UserService.queryForUser(userId, {});
          if (
            (suspicious !== undefined && suspicious !== null && suspicious) ||
            userData.suspicious
          ) {
            return res.status(403).json({
              error: "Forbidden: suspicious users cannot become cashiers",
            });
          }
          updateFields.role = RoleType.cashier;
          break;
        }

        case "manager":
        case "superuser":
          if (userRole !== RoleType.superuser) {
            return res
              .status(403)
              .json({ error: "Forbidden: insufficient privileges" });
          }
          updateFields.role = RoleType[role];
          break;

        default:
          return res.status(400).json({ error: "Bad Request: invalid role" });
      }
    } catch (error) {
      return res.status(409).json({ error: error.message });
    }
  }

  try {
    const updatedUser = await UserService.updateUserData(userId, updateFields);
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(409).json({ error: error.message });
  }
}

async function createRedemption(req, res) {
  const { type, amount, remark } = req.body;

  if (type !== "redemption") {
    return res.status(400).json(`Invalid type parameter - ${type}`);
  }

  if (!Number.isInteger(amount) || amount <= 0) {
    return res.status(400).json(`Invalid type parameter - ${amount}`);
  }

  if (remark && typeof remark !== "string") {
    return res.status(400).json(`Invalid type parameter - ${remark}`);
  }

  const { utorid } = req.user;

  try {
    const newTransaction = await TransactionService.createRedemption(
      utorid,
      amount,
      remark ?? "",
    );
    const response = {
      id: newTransaction.id,
      utorid: newTransaction.targetUser.utorid,
      type: type,
      processedBy: newTransaction.processedByUser
        ? newTransaction.processedByUser.utorid
        : null,
      amount: newTransaction.amount,
      remark: newTransaction.remark,
      createdBy: newTransaction.user.utorid,
      createdAt: newTransaction.createdAt,
    };
    res.status(201).json(response);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
}

async function retrieveTransactions(req, res) {
  if (!validRetrieveBody(req))
    return res.status(400).json({ error: "Bad Request" });

  const { promotionId, search, type, relatedId, amount, operator, page, limit } =
    req.query;

  const pageNum = page ? parseInt(page, 10) : 1;
  const limitNum = limit ? parseInt(limit, 10) : 10;

  let promotionIdNum, relatedIdNum, amountNum;

  if (promotionId) {
    promotionIdNum = parseInt(promotionId, 10);
  }
  if (relatedId) {
    relatedIdNum = parseInt(relatedId, 10);
  }
  if (amount) {
    amountNum = parseInt(amount, 10);
  }

  const { id } = req.user;

  try {
    const [count, results] = await TransactionService.retrieveUserTransactions(
      id,
      type,
      search,
      relatedIdNum,
      promotionIdNum,
      amountNum,
      operator,
      pageNum,
      limitNum,
    );

    const formattedResults = results.map((transaction) => {
      const transactionResObj = {
        ...transaction,
        promotionIds: transaction.promotions.map(promo => promo.id),
      }
      delete transactionResObj.promotions;
      return transactionResObj;
    });

    res.status(200).json({ count, results: formattedResults });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
}

async function retrieveEvents(req, res) {
  if (!validRetrieveBody(req))
    return res.status(400).json({ error: "Bad Request" });

  const { name, location, started, ended, page, limit } =
    req.query;

  const pageNum = page ? parseInt(page, 10) : 1;
  const limitNum = limit ? parseInt(limit, 10) : 10;

  const { id } = req.user;

  try {
    const eventData = await EventService.retrieveEvents(id, name, location, started, ended, pageNum, limitNum);
    res.status(200).json({ count: eventData.count, results: eventData.results });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
}

async function retrieveEvents(req, res) {
  if (!validRetrieveBody(req))
    return res.status(400).json({ error: "Bad Request" });

  const { name, location, started, ended, page, limit } =
    req.query;

  const pageNum = page ? parseInt(page, 10) : 1;
  const limitNum = limit ? parseInt(limit, 10) : 10;

  const { id } = req.user;

  try {
    const eventData = await EventService.retrieveEvents(id, name, location, started, ended, pageNum, limitNum);
    res.status(200).json({ count: eventData.count, results: eventData.results });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
}

async function createTransfer(req, res) {
  const { type, amount, remark } = req.body;
  const { id: senderId } = req.user;
  const recipientId = req.userId;

  const amountNum = Number(amount);

  if (type !== "transfer") {
    return res.status(400).json({ error: "Bad Request" });
  }

  if (!Number.isInteger(amountNum) || amountNum <= 0) {
    return res.status(400).json({ error: "Bad Request" });
  }

  if (remark && typeof remark !== "string") {
    return res.status(400).json({ error: "Bad Request" });
  }

  try {
    const { senderTransaction, recipientTransaction } =
      await TransactionService.createTransfer(
        senderId,
        recipientId,
        amountNum,
        remark,
      );
    const response = {
      id: senderTransaction.id,
      sender: senderTransaction.user.utorid,
      recipient: senderTransaction.targetUser.utorid,
      type: type,
      sent: Math.abs(senderTransaction.amount),
      remark: senderTransaction.remark,
      createdBy: senderTransaction.user.utorid,
    };

    res.status(201).json(response);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
}

async function deleteRedemption(req, res) {
  const { id } = req.body;

  console.log(req.body, id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Bad Request" });
  }

  try {
    const response = await TransactionService.deleteRedemption(id);

    res.status(201).json(response);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
}

async function updateMyUserInfo(req, res) {
  const { name, email, birthday } = req.body;
  const { id } = req.user;
  const avatar = req.file;

  if (
    Object.keys(req.body).length === 0 ||
    (!name && !email && !birthday && !avatar)
  )
    return res
      .status(400)
      .json({ error: "Bad Request: No valid fields to update" });
  if (name && (name.length < 1 || name.length > 50))
    return res.status(400).json({ error: "Bad Request: Invalid name" });
  if (email && !email.endsWith("@mail.utoronto.ca"))
    return res.status(400).json({ error: "Bad Request: Invalid email" });
  if (birthday && !isValidYYYYMMDD(birthday))
    return res.status(400).json({ error: "Bad Request: Invalid birthday" });

  try {
    const updatedUserInfo = await UserService.updateMyUserInfo(
      id,
      name,
      email,
      birthday,
      avatar,
    );
    res.status(200).json(updatedUserInfo);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
}

async function getMyUserInfo(req, res) {
  const { id } = req.user;

  try {
    const userInfo = await UserService.getMyUserInfo(id);
    res.status(200).json(userInfo);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
}

async function updateMyPassword(req, res) {
  const { old, new: newPassword } = req.body;
  const { id } = req.user;

  if (
    !old ||
    !newPassword ||
    typeof old !== "string" ||
    typeof newPassword !== "string"
  ) {
    return res
      .status(400)
      .json({ error: "Bad Request: Missing/invalid fields" });
  }

  try {
    await UserService.updateMyUserPassword(id, old, newPassword);
    res.status(200).send();
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
}

module.exports = {
  registerUser,
  getFilteredUsers,
  getSpecificUser,
  updateSpecificUser,
  createRedemption,
  createTransfer,
  retrieveTransactions,
  retrieveEvents,
  updateMyUserInfo,
  getMyUserInfo,
  updateMyPassword,
  deleteRedemption,
};
