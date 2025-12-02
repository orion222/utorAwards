const express = require("express");
const {
  createPromotion,
  retrievePromotion,
  retrieveSinglePromotion,
  updateSinglePromotion,
  deleteSinglePromotion,
} = require("../controllers/promotionController");
const { verifyToken, checkClearance } = require("../middleware/auth");

const promotionRouter = express.Router();

promotionRouter.param("promotionId", (req, res, next, promotionId) => {
  const promotionIdInt = parseInt(promotionId, 10);
  const trimmedPromotionId = promotionId.trim();
  if (
    !Number.isInteger(promotionIdInt) ||
    String(promotionIdInt) !== trimmedPromotionId ||
    promotionIdInt < 0
  ) {
    return res.status(400).json({ error: "Bad Request: Invalid promotionId" });
  }

  req.promotionId = promotionIdInt;
  next();
});

promotionRouter.post(
  "/",
  verifyToken,
  checkClearance(["manager", "superuser"]),
  createPromotion,
);

promotionRouter.get(
  "/",
  verifyToken,
  retrievePromotion,
);

promotionRouter.get("/:promotionId", verifyToken, retrieveSinglePromotion);

promotionRouter.patch(
  "/:promotionId",
  verifyToken,
  checkClearance(["manager", "superuser"]),
  updateSinglePromotion,
);

promotionRouter.delete(
  "/:promotionId",
  verifyToken,
  checkClearance(["manager", "superuser"]),
  deleteSinglePromotion,
);

module.exports = promotionRouter;
