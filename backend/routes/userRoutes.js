const express = require("express");
const {
  registerUser,
  getFilteredUsers,
  getSpecificUser,
  updateSpecificUser,
  createRedemption,
  retrieveTransactions,
  retrieveEvents,
  updateMyUserInfo,
  getMyUserInfo,
  updateMyPassword,
  createTransfer,
  deleteRedemption,
  retrieveMyEventInvitations,
  retrieveMyEventManagement,
  retrieveLeaderboard,
} = require("../controllers/userController");
const { verifyToken, checkClearance } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { doubleCsrfProtection } = require("./authRoutes");

const userRouter = express.Router();

userRouter.param("userId", (req, res, next, userId) => {
  const userIdInt = parseInt(userId, 10);
  const trimmedUserId = userId.trim();

  if (
    !Number.isInteger(userIdInt) ||
    String(userIdInt) !== trimmedUserId ||
    userIdInt < 0
  ) {
    return res.status(400).json({ error: "Bad Request: Invalid userId" });
  }

  req.userId = userIdInt;
  next();
});

userRouter.post(
  "/",
  doubleCsrfProtection,
  verifyToken,
  checkClearance(["cashier", "manager", "superuser"]),
  registerUser,
);

userRouter.get(
  "/",
  verifyToken,
  checkClearance(["regular", "cashier", "manager", "superuser"]),
  getFilteredUsers,
);

userRouter.patch("/me", doubleCsrfProtection, verifyToken, upload.single("avatar"), updateMyUserInfo);

userRouter.get("/me", verifyToken, getMyUserInfo);

userRouter.get("/leaderboard", verifyToken, retrieveLeaderboard);

userRouter.get(
  "/:userId",
  verifyToken,
  checkClearance(["cashier", "manager", "superuser"]),
  getSpecificUser,
);

userRouter.patch(
  "/:userId",
  doubleCsrfProtection,
  verifyToken,
  checkClearance(["manager", "superuser"]),
  updateSpecificUser,
);

userRouter.patch("/me/password", doubleCsrfProtection, verifyToken, updateMyPassword);

userRouter.post("/me/transactions", doubleCsrfProtection, verifyToken, createRedemption);

userRouter.delete("/me/transactions", doubleCsrfProtection, verifyToken, deleteRedemption);

userRouter.get("/me/transactions", verifyToken, retrieveTransactions);

userRouter.get("/me/events", verifyToken, retrieveEvents);

userRouter.get("/me/events/invitations", verifyToken, retrieveMyEventInvitations);

userRouter.get("/me/events/management", verifyToken, retrieveMyEventManagement);

userRouter.post("/:userId/transactions", doubleCsrfProtection, verifyToken, createTransfer);


module.exports = userRouter;