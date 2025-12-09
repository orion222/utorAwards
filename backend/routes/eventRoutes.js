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
  getSpecificEventUsers,
} = require("../controllers/eventController");
const { verifyToken, checkClearance } = require("../middleware/auth");
const {getSpecificUser} = require("../controllers/userController");
const { doubleCsrfProtection } = require("./authRoutes");

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
  doubleCsrfProtection,
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

eventRouter.get(
  "/:eventId/users",
  verifyToken,
  checkClearance(["organizer", "regular", "cashier", "manager", "superuser"]),
  getSpecificEventUsers,
);

eventRouter.patch(
  "/:eventId",
  doubleCsrfProtection,
  verifyToken,
  checkClearance(["organizer", "manager", "superuser"]),
  updateEvent,
);

eventRouter.delete(
  "/:eventId",
  doubleCsrfProtection,
  verifyToken,
  checkClearance(["manager", "superuser"]),
  deleteEvent,
);

eventRouter.post(
  "/:eventId/guests/me",
  doubleCsrfProtection,
  verifyToken,
  checkClearance(["regular", "cashier", "manager", "superuser"]),
  signUpForEvent,
);

eventRouter.delete(
  "/:eventId/guests/me",
  doubleCsrfProtection,
  verifyToken,
  checkClearance(["regular", "cashier", "manager", "superuser"]),
  removeFromEvent,
);

eventRouter.post(
  "/:eventId/transactions",
  doubleCsrfProtection,
  verifyToken,
  checkClearance(["regular", "cashier", "manager", "superuser"]),
  createReward,
);

eventRouter.post(
  "/:eventId/organizers",
  doubleCsrfProtection,
  verifyToken,
  checkClearance(["manager", "superuser"]),
  addEventOrganizer,
);

eventRouter.delete(
  "/:eventId/organizers/:userId",
  doubleCsrfProtection,
  verifyToken,
  checkClearance(["manager", "superuser"]),
  removeEventOrganizer,
);

eventRouter.post(
  "/:eventId/guests",
  doubleCsrfProtection,
  verifyToken,
  checkClearance(["organizer", "manager", "superuser"]),
  addEventGuest,
);

eventRouter.delete(
  "/:eventId/guests/:userId",
  doubleCsrfProtection,
  verifyToken,
  checkClearance(["manager", "superuser"]),
  removeEventGuest,
);

module.exports = eventRouter;
