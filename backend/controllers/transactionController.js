const { TransactionService } = require("../services/transactionService");
const {
  validAdjustmentBody,
  validPurchaseBody,
  validRetrieveBody,
  mapByTransactionType,
} = require("../utils/transactionHelpers");
const { convertOrderByField } = require("../utils/generalHelpers");

async function createTransaction(req, res) {
  const { type, spent, amount, relatedId } = req.body;

  if (type !== "purchase" && type !== "adjustment") {
    return res.status(400).json({ error: "Bad Request" });
  }

  const spentNum = Number(spent);
  const amountNum = Number(amount);

  if (type === "purchase" && (isNaN(spentNum) || spentNum < 0)) {
    return res
      .status(400)
      .json({ error: `Bad Request: Invalid spent parameter ${spent}` });
  }

  if (
    type === "adjustment" &&
    (isNaN(amountNum) || !Number.isInteger(amountNum))
  ) {
    return res
      .status(400)
      .json({ error: `Bad Request: Invalid amount parameter ${amount}` });
  }

  const { role } = req.user;

  if (type === "adjustment" && role !== "manager" && role !== "superuser") {
    return res.status(403).json({ error: "Forbidden" });
  }

  const { utorid, promotionIds, remark } = req.body;

  if (
    !utorid ||
    typeof utorid !== "string" ||
    (utorid.length !== 7 && utorid.length !== 8)
  ) {
    return res.status(400).json({ error: "Bad Request" });
  }

  if (!type || (type !== "purchase" && type !== "adjustment")) {
    return res.status(400).json({ error: "Bad Request" });
  }

  if (
    (promotionIds && !Array.isArray(promotionIds)) ||
    (remark && typeof remark !== "string")
  ) {
    return res.status(400).json({ error: "Bad Request" });
  }

  const relatedIdNum = Number(relatedId);
  if (
    type === "adjustment" &&
    (!relatedId || !Number.isInteger(relatedIdNum))
  ) {
    return res
      .status(400)
      .json({ error: `Bad Request: Invalid relatedId parameter ${relatedId}` });
  }

  const promotionIdsArray = promotionIds ?? [];
  const remarkText = remark ?? "";

  for (id of promotionIdsArray) {
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Bad Request" });
    }
  }

  const validitity =
    type === "purchase" ? validPurchaseBody(req) : validAdjustmentBody(req);

  if (!validitity) {
    return res.status(400).json({ error: "Bad Request" });
  }

  try {
    const newTransaction =
      type === "purchase"
        ? await TransactionService.createPurchase(
            req.user.utorid,
            utorid,
            type,
            spentNum,
            promotionIdsArray,
            remarkText,
          )
        : await TransactionService.createAdjustment(
            req.user.utorid,
            utorid,
            type,
            amountNum,
            relatedIdNum,
            promotionIdsArray,
            remarkText,
          );
    const response = {
      id: newTransaction.id,
      utorid: newTransaction.targetUser.utorid,
      type: type,
      remark: newTransaction.remark,
      promotionIds: newTransaction.promotions.map((promo) => promo.id),
      createdBy: newTransaction.user.utorid,
    };

    if (type === "purchase") {
      response.spent = newTransaction.spent;
      if (newTransaction.suspicious) {
        response.earned = 0;
      } else {
        response.earned = newTransaction.amount;
      }
    } else if (type === "adjustment") {
      response.relatedId = newTransaction.relatedId;
      response.amount = newTransaction.amount;
    }
    await TransactionService.updatePoints(newTransaction);
    res.status(201).json(response);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
}

async function retrieveTransactions(req, res) {
  if (!validRetrieveBody(req))
    return res.status(400).json({ error: "Bad Request" });

  const {
    search,
    name,
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
  } = req.query;

  const suspiciousBool =
    suspicious === "true" ? true : suspicious === "false" ? false : null;
  const promotionIdNum = promotionId ? Number(promotionId) : null;
  const relatedIdNum = relatedId ? Number(relatedId) : null;
  const amountNum = amount ? Number(amount) : null;

  const pageNum = page ? parseInt(page, 10) : 1;
  const limitNum = limit ? parseInt(limit, 10) : 10;

  let orderByObj = null;
  if (orderBy) {
    const validFields = ["createdAt", "amount", "spent", "type"];
    orderByObj = convertOrderByField(orderBy, validFields);
    if (!orderByObj) {
      return res.status(400).json({ error: "Bad Request: invalid orderBy value" });
    }
  }

  try {
    const [count, results] = await TransactionService.retrieveTransactions(
      name,
      search,
      createdBy,
      suspiciousBool,
      promotionIdNum,
      type,
      relatedIdNum,
      amountNum,
      operator,
      pageNum,
      limitNum,
      orderByObj,
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
    res.status(error.statusCode || 500).json({ error: error.message });
  }
}

async function retrieveSingleTransaction(req, res) {
  const transactionId = req.transactionId;
  const { utorid, role } = req.user;

  try {
    const transaction =
      await TransactionService.retrieveSingleTransaction(transactionId, role, utorid);
    res.status(200).json(transaction);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
}

async function updateTransactionSuspicion(req, res) {
  const transactionId = req.transactionId;
  const { suspicious } = req.body;

  if (suspicious === undefined || typeof suspicious !== "boolean") {
    return res
      .status(400)
      .json({ error: "Bad Request: Invalid suspicious status" });
  }

  try {
    const updatedTransaction =
      await TransactionService.updateTransactionSuspicion(
        transactionId,
        suspicious,
      );
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
}

async function updateTransactionProcessed(req, res) {
  const transactionId = req.transactionId;
  const { processed } = req.body;
  const { id } = req.user;

  if (!processed || typeof processed !== "boolean") {
    return res
      .status(400)
      .json({ error: "Bad Request: Invalid processed status" });
  }

  try {
    const updatedTransaction =
      await TransactionService.updateTransactionProcessed(id, transactionId);
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
}

module.exports = {
  createTransaction,
  retrieveTransactions,
  retrieveSingleTransaction,
  updateTransactionSuspicion,
  updateTransactionProcessed,
};
