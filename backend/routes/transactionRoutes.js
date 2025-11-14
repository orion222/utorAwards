const express = require('express');
const { createTransaction, retrieveTransactions, retrieveSingleTransaction, updateTransactionSuspicion, updateTransactionProcessed} = require('../controllers/transactionController');
const { verifyToken, checkClearance } = require('../middleware/auth');

const transactionRouter = express.Router();

transactionRouter.param('transactionId', (req, res, next, transactionId) => {
    const transactionIdInt = parseInt(transactionId, 10);
    const trimmedTransactionId = transactionId.trim();
    if (!Number.isInteger(transactionIdInt) || String(transactionIdInt) !== trimmedTransactionId || transactionIdInt < 0) {
        return res.status(400).json({ error: 'Bad Request: Invalid transactionId' });
    }

    req.transactionId = transactionIdInt;
    next();
});

transactionRouter.post("/", verifyToken, checkClearance(["cashier", "manager", "superuser"]), createTransaction);

transactionRouter.get("/", verifyToken, checkClearance(["manager", "superuser"]), retrieveTransactions);

transactionRouter.get("/:transactionId", verifyToken, checkClearance(["manager", "superuser"]), retrieveSingleTransaction);

transactionRouter.patch("/:transactionId/suspicious", verifyToken, checkClearance(["manager", "superuser"]), updateTransactionSuspicion);

transactionRouter.patch("/:transactionId/processed", verifyToken, checkClearance(["cashier", "manager", "superuser"]), updateTransactionProcessed);

module.exports = transactionRouter;