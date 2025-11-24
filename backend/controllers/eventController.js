const { EventService } = require("../services/eventService");
const { TransactionService } = require("../services/transactionService");
const { RoleType, TransactionType } = require("@prisma/client");
const { isInISODateString } = require("../utils/generalHelpers");

async function getFilteredEvents(req, res) {
  const { search, name, location, started, ended, showFull, page, limit, published } =
    req.query;

  if (showFull && showFull !== "true" && showFull !== "false") {
    return res
      .status(400)
      .json({ error: "Bad Request: invalid showFull value" });
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

  if (pageNum < 1 || limitNum < 1) {
    return res
      .status(400)
      .json({ error: "Bad Request: page must be at least 1" });
  }

  const userRole = req.user.role;
  if (published && published !== "true" && published !== "false") {
    return res
      .status(400)
      .json({ error: "Bad Request: invalid published value" });
  }
  if (
    published &&
    userRole !== RoleType.manager &&
    userRole !== RoleType.superuser
  ) {
    return res.status(403).json({
      error: "only managers and superusers can see unpublished events",
    });
  }

  if (started && ended) {
    return res
      .status(400)
      .json({ error: "cannot specify both started and ended" });
  }

  try {
    const filteredEventsData = await EventService.getFilteredEvents(
      search,
      name,
      location,
      started,
      ended,
      showFull,
      pageNum,
      limitNum,
      published,
      userRole,
    );
    res.status(200).json(filteredEventsData);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
}

async function createEvent(req, res) {
  const { name, description, location, startTime, endTime, capacity, points } =
    req.body;
  if (!name || !description || !location || !startTime || !endTime || !points) {
    return res.status(400).json({ error: "Bad Request" });
  }

  if (capacity && !Number.isInteger(capacity)) {
    return res.status(400).json({ error: "Bad Request" });
  }

  if (
    typeof name !== "string" ||
    typeof description !== "string" ||
    typeof location !== "string" ||
    typeof startTime !== "string" ||
    typeof endTime !== "string" ||
    !Number.isInteger(points)
  ) {
    return res.status(400).json({ error: "Bad Request" });
  }

  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (
    !isInISODateString(startTime) ||
    !isInISODateString(endTime) ||
    isNaN(start.getTime()) ||
    isNaN(end.getTime()) ||
    end < start ||
    (Number.isInteger(capacity) && capacity <= 0) ||
    points <= 0
  ) {
    return res.status(400).json({ error: "Bad Request" });
  }

  try {
    const cap = capacity === undefined ? null : capacity;
    const newEvent = await EventService.createEvent(
      name,
      description,
      location,
      start,
      end,
      cap,
      points,
      req.user.id,
    );
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
}

async function createReward(req, res) {
  const { type, utorid, amount } = req.body;
  if (!type || type !== TransactionType.event) {
    return res
      .status(400)
      .json({ error: `Bad Request: Invalid type given: ${type}, not 'event'` });
  }

  if (!Number.isInteger(amount) || amount <= 0) {
    return res
      .status(400)
      .json({ error: `Bad Request: Invalid amount ${amount}` });
  }

  if (
    utorid &&
    (typeof utorid !== "string" || (utorid.length !== 7 && utorid.length !== 8))
  ) {
    return res
      .status(400)
      .json({ error: `Bad Request: Invalid utorid ${utorid}` });
  }

  const creatorUtorid = req.user.utorid;

  const eventId = req.eventId;

  try {
    const newTransaction = await TransactionService.createEvent(
      creatorUtorid,
      utorid,
      type,
      amount,
      eventId,
    );
    res.status(201).json(newTransaction);
  } catch (error) {
    return res.status(error.statusCode).json({ error: error.message });
  }
}

async function getSpecificEvent(req, res) {
  const eventId = req.eventId;
  if (!eventId || !Number.isInteger(eventId)) {
    return res.status(400).json({ error: "Bad Request" });
  }
  const userId = req.user.id;
  const userRole = req.user.role;
  try {
    const eventData = await EventService.getSpecificEvent(
      eventId,
      userId,
      userRole,
    );
    res.status(200).json(eventData);
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message });
  }
}

async function updateEvent(req, res) {
  const role = req.user.role;
  const id = req.eventId;

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Bad Request" });
  }
  const {
    name,
    description,
    location,
    startTime,
    endTime,
    capacity,
    points,
    published,
  } = req.body;
  const updateData = {};
  const now = new Date();

  if (name) updateData.name = name;

  if (description) updateData.description = description;

  if (location) updateData.location = location;

  if (startTime) {
    const start = new Date(startTime);
    if (start > now) {
      updateData.startTime = start;
    } else {
      return res.status(400).json({ error: "startTime is in the past" });
    }
  }

  if (endTime) {
    const end = new Date(endTime);
    if (end > now) {
      updateData.endTime = end;
    } else {
      return res.status(400).json({ error: "endTime is in the past" });
    }
  }

  if (capacity) {
    if (capacity > 0) {
      updateData.capacity = capacity;
    } else {
      return res.status(400).json({ error: "capacity must be positive" });
    }
  }

  if (points) {
    if (role === RoleType.manager || role === RoleType.superuser) {
      if (points > 0) {
        updateData.points = points;
      } else {
        return res.status(400).json({ error: "points must be positive" });
      }
    } else {
      return res.status(403).json({ error: "forbidden" });
    }
  }

  if (typeof published === "boolean") {
    if (published === false) {
      return res.status(400).json({ error: "Bad Request" });
    } else if (role === RoleType.manager || role === RoleType.superuser) {
      updateData.published = published;
    } else {
      return res.status(403).json({ error: "forbidden" });
    }
  }

  try {
    const updatedEvent = await EventService.updateEvent(id, updateData);
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
}

async function deleteEvent(req, res) {
  const id = req.eventId;
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Bad Request" });
  }
  try {
    const deletedEvent = await EventService.deleteEvent(id);
    res.status(204).send("Success");
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message });
  }
}

async function signUpForEvent(req, res) {
  const eventId = req.eventId;
  const userId = req.user.id;
  if (!Number.isInteger(eventId)) {
    return res.status(400).json({ error: "Bad Request" });
  }
  try {
    const addedUser = await EventService.rsvpForEvent(eventId, userId);
    res.status(201).json(addedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function removeFromEvent(req, res) {
  const eventId = req.eventId;
  const userId = req.user.id;
  if (!Number.isInteger(eventId)) {
    return res.status(400).json({ error: "Bad Request" });
  }
  try {
    // retVal: 0 = success, 1 = event has ended, 2 = user never rsvp'ed to the event
    const retVal = await EventService.removeFromEvent(eventId, userId);
    if (retVal === 2) {
      res.status(404).json({ error: "User did not RSVP to this event" });
    } else if (retVal === 1) {
      res.status(410).json({ error: "Event has already ended" });
    } else {
      res.status(204).send("success");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function addEventOrganizer(req, res) {
  const eventId = req.eventId;
  const { utorid } = req.body;

  if (typeof utorid !== "string")
    res.status(400).json({ error: "Bad payload" });

  try {
    const newEvent = await EventService.addEventOrganizer(eventId, utorid);
    res.status(201).json(newEvent);
  } catch (e) {
    res.status(e.statusCode || 500).send(e.message);
  }
}

async function removeEventOrganizer(req, res) {
  const eventId = req.eventId;
  const userId = req.userId;

  try {
    await EventService.removeEventOrganizer(eventId, userId);
    res.status(204).send("Success");
  } catch (e) {
    res.status(e.statusCode || 500).send(e.message);
  }
}

async function addEventGuest(req, res) {
  const eventId = req.eventId;
  const { utorid } = req.body;

  if (typeof utorid !== "string") res.status(400).send("Bad payload");

  try {
    const newEvent = await EventService.addEventGuest(eventId, utorid);
    res.status(201).json(newEvent);
  } catch (e) {
    res.status(e.statusCode || 500).send(e.message);
  }
}

async function removeEventGuest(req, res) {
  const eventId = req.eventId;
  const userId = req.userId;

  try {
    await EventService.removeEventGuest(eventId, userId);
    res.status(204).send("Success");
  } catch (e) {
    res.status(e.statusCode || 500).send(e.message);
  }
}

module.exports = {
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
};
