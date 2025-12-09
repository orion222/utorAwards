const express = require("express");
const {
  createTransaction,
  retrieveTransactions,
  retrieveSingleTransaction,
  updateTransactionSuspicion,
  updateTransactionProcessed,
} = require("../controllers/transactionController");
const { verifyToken, checkClearance } = require("../middleware/auth");
const { doubleCsrfProtection } = require("./authRoutes");

const transactionRouter = express.Router();

transactionRouter.param("transactionId", (req, res, next, transactionId) => {
  const transactionIdInt = parseInt(transactionId, 10);
  const trimmedTransactionId = transactionId.trim();
  if (
    !Number.isInteger(transactionIdInt) ||
    String(transactionIdInt) !== trimmedTransactionId ||
    transactionIdInt < 0
  ) {
    return res
      .status(400)
      .json({ error: "Bad Request: Invalid transactionId" });
  }

  req.transactionId = transactionIdInt;
  next();
});

transactionRouter.post(
  "/",
  doubleCsrfProtection,
  verifyToken,
  checkClearance(["cashier", "manager", "superuser"]),
  createTransaction,
);

transactionRouter.get(
  "/",
  verifyToken,
  checkClearance(["manager", "superuser"]),
  retrieveTransactions,
);

transactionRouter.get(
  "/:transactionId",
  verifyToken,
  retrieveSingleTransaction,
);

transactionRouter.patch(
  "/:transactionId/suspicious",
  doubleCsrfProtection,
  verifyToken,
  checkClearance(["manager", "superuser"]),
  updateTransactionSuspicion,
);

transactionRouter.patch(
  "/:transactionId/processed",
  doubleCsrfProtection,
  verifyToken,
  checkClearance(["cashier", "manager", "superuser"]),
  updateTransactionProcessed,
);

module.exports = transactionRouter;
