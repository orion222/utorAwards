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
  verifyToken,
  checkClearance(["cashier", "manager", "superuser"]),
  registerUser,
);

userRouter.get(
  "/",
  verifyToken,
  checkClearance(["manager", "superuser"]),
  getFilteredUsers,
);

userRouter.patch("/me", verifyToken, upload.single("avatar"), updateMyUserInfo);

userRouter.get("/me", verifyToken, getMyUserInfo);

userRouter.get(
  "/:userId",
  verifyToken,
  checkClearance(["cashier", "manager", "superuser"]),
  getSpecificUser,
);

userRouter.patch(
  "/:userId",
  verifyToken,
  checkClearance(["manager", "superuser"]),
  updateSpecificUser,
);

userRouter.patch("/me/password", verifyToken, updateMyPassword);

userRouter.post("/me/transactions", verifyToken, createRedemption);

userRouter.delete("/me/transactions", verifyToken, deleteRedemption);

userRouter.get("/me/transactions", verifyToken, retrieveTransactions);

userRouter.get("/me/events", verifyToken, retrieveEvents);

userRouter.get("/me/events/invitations", verifyToken, retrieveMyEventInvitations);

userRouter.get("/me/events/management", verifyToken, retrieveMyEventManagement);

userRouter.post("/:userId/transactions", verifyToken, createTransfer);

userRouter.get("/leaderboard", verifyToken, retrieveLeaderboard);

module.exports = userRouter;