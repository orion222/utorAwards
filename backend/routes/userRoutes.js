const express = require("express");
const {
  registerUser,
  getFilteredUsers,
  getSpecificUser,
  updateSpecificUser,
  createRedemption,
  retrieveTransactions,
  updateMyUserInfo,
  getMyUserInfo,
  updateMyPassword,
  createTransfer,
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

userRouter.get("/me/transactions", verifyToken, retrieveTransactions);

userRouter.post("/:userId/transactions", verifyToken, createTransfer);

module.exports = userRouter;
