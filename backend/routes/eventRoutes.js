const express = require("express");
const {
  createEvent,
  getFilteredEvents,
  createReward,
  getSpecificEvent,
  updateEvent,
  deleteEvent,
  signUpForEvent,
  removeFromEvent,
  addEventOrganizer,
  removeEventOrganizer,
  addEventGuest,
  removeEventGuest,
} = require("../controllers/eventController");
const { verifyToken, checkClearance } = require("../middleware/auth");

const eventRouter = express.Router();

eventRouter.param("userId", (req, res, next, userId) => {
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

eventRouter.param("eventId", (req, res, next, eventId) => {
  const eventIdInt = parseInt(eventId, 10);
  const trimmedEventId = eventId.trim();
  if (
    !Number.isInteger(eventIdInt) ||
    String(eventIdInt) !== trimmedEventId ||
    eventIdInt < 0
  ) {
    return res.status(400).json({ error: "Bad Request: Invalid eventId" });
  }

  req.eventId = eventIdInt;
  next();
});

eventRouter.get(
  "/",
  verifyToken,
  checkClearance(["regular", "cashier", "manager", "superuser"]),
  getFilteredEvents,
);

eventRouter.post(
  "/",
  verifyToken,
  checkClearance(["manager", "superuser"]),
  createEvent,
);

eventRouter.get(
  "/:eventId",
  verifyToken,
  checkClearance(["organizer", "regular", "cashier", "manager", "superuser"]),
  getSpecificEvent,
);

eventRouter.patch(
  "/:eventId",
  verifyToken,
  checkClearance(["organizer", "manager", "superuser"]),
  updateEvent,
);

eventRouter.delete(
  "/:eventId",
  verifyToken,
  checkClearance(["manager", "superuser"]),
  deleteEvent,
);

eventRouter.post(
  "/:eventId/guests/me",
  verifyToken,
  checkClearance(["regular"]),
  signUpForEvent,
);

eventRouter.delete(
  "/:eventId/guests/me",
  verifyToken,
  checkClearance(["regular"]),
  removeFromEvent,
);

eventRouter.post(
  "/:eventId/transactions",
  verifyToken,
  checkClearance(["regular", "cashier", "manager", "superuser"]),
  createReward,
);

eventRouter.post(
  "/:eventId/organizers",
  verifyToken,
  checkClearance(["manager", "superuser"]),
  addEventOrganizer,
);

eventRouter.delete(
  "/:eventId/organizers/:userId",
  verifyToken,
  checkClearance(["manager", "superuser"]),
  removeEventOrganizer,
);

eventRouter.post(
  "/:eventId/guests",
  verifyToken,
  checkClearance(["organizer", "manager", "superuser"]),
  addEventGuest,
);

eventRouter.delete(
  "/:eventId/guests/:userId",
  verifyToken,
  checkClearance(["manager", "superuser"]),
  removeEventGuest,
);

module.exports = eventRouter;
