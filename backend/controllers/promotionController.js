const { PromotionService } = require("../services/promotionService");
const { RoleType } = require("@prisma/client");
const { isInISODateString, convertOrderByField } = require("../utils/generalHelpers");

async function createPromotion(req, res) {
  const {
    name,
    description,
    type,
    startTime,
    endTime,
    minSpending,
    rate,
    points,
  } = req.body;

  if (!name || !description || !type || !startTime || !endTime) {
    return res
      .status(400)
      .json({ error: "Bad Request: Missing required payload" });
  }

  if (
    typeof name !== "string" ||
    typeof description !== "string" ||
    typeof type !== "string" ||
    typeof startTime !== "string" ||
    typeof endTime !== "string"
  ) {
    return res.status(400).json({ error: "Bad Request: Payload type invalid" });
  }

  if (type !== "automatic" && type !== "one-time") {
    return res
      .status(400)
      .json({ error: `Bad Request: Invalid promotion type ${type}` });
  }

  const start = new Date(startTime);
  const end = new Date(endTime);
  const now = new Date();
  if (
    isNaN(start.getTime()) ||
    isNaN(end.getTime()) ||
    start < now ||
    end <= start
  ) {
    return res.status(400).json({
      error: `Bad Request: Invalid startTime ${startTime} or endTime ${endTime}`,
    });
  }

  const minSpendingNum = Number(minSpending);
  const rateNum = Number(rate);
  const pointsNum = Number(points);

  if (minSpending && (isNaN(minSpendingNum) || minSpendingNum <= 0)) {
    return res
      .status(400)
      .json({ error: `Bad Request: Invalid minSpending ${minSpending}` });
  }

  if (rate && (isNaN(rateNum) || rateNum <= 0)) {
    return res
      .status(400)
      .json({ error: `Bad Request: Invalid minSpending ${rate}` });
  }

  if (
    points &&
    (isNaN(pointsNum) || !Number.isInteger(pointsNum) || pointsNum <= 0)
  ) {
    return res
      .status(400)
      .json({ error: `Bad Request: Invalid points ${points}` });
  }

  const { utorid } = req.user;

  try {
    const newPromotion = await PromotionService.createPromotion(
      name,
      description,
      type,
      startTime,
      endTime,
      minSpendingNum,
      rateNum,
      pointsNum,
      utorid,
    );
    const response = {
      id: newPromotion.id,
      name: newPromotion.name,
      description: newPromotion.description,
      type: newPromotion.type,
      startTime: newPromotion.startTime,
      endTime: newPromotion.endTime,
      minSpending: newPromotion.minSpending,
      rate: newPromotion.rate ? newPromotion.rate : null,
      points: newPromotion.points,
    };
    res.status(201).json(response);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
}

async function retrievePromotion(req, res) {
  const user = req.user;
  const { search, name, type, page, limit, started, ended, orderBy } = req.query;

  var pageNum = Number(page);
  var limitNum = Number(limit);

  if (
    (name && typeof name !== "string") ||
    (type && typeof type !== "string")
  ) {
    return res
      .status(400)
      .json({ error: "Bad Request: Invalid query parameters" });
  }

  let orderByObj = null;
  if (orderBy) {
    const validFields = ["startTime", "endTime", "points", "minSpending", "rate"];
    orderByObj = convertOrderByField(orderBy, validFields);
    if (!orderByObj) {
      return res.status(400).json({ error: "Bad Request: invalid orderBy value" });
    }
  }

  if (
    (page && (isNaN(pageNum) || !Number.isInteger(pageNum))) ||
    (limit && (isNaN(limitNum) || !Number.isInteger(limitNum)))
  ) {
    return res
      .status(400)
      .json({ error: "Bad Request: Invalid pagination parameters" });
  }

  pageNum = page ? pageNum : 1;
  limitNum = limit ? limitNum : 10;

  if (
    req.user.role === RoleType.manager ||
    req.user.role === RoleType.superuser
  ) {
    if (started && ended)
      return res.status(400).json({
        error: "Bad Request: Cannot have both started and ended parameters",
      });
    if (started && started !== "true" && started !== "false")
      return res
        .status(400)
        .json({ error: "Bad Request: Invalid started parameter" });
    if (ended && ended !== "true" && ended !== "false")
      return res
        .status(400)
        .json({ error: "Bad Request: Invalid ended parameter" });
  }

  var startedBool =
    started === "true" || req.user.role === RoleType.regular ? true : false;
  var endedBool =
    ended === "false" || req.user.role === RoleType.regular ? false : true;

  try {
    const promotionData = await PromotionService.retrievePromotions(
      user.id,
      user.role,
      search,
      name,
      type,
      pageNum,
      limitNum,
      startedBool,
      endedBool,
      orderByObj,
    );
    res.status(200).json(promotionData);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
}

async function retrieveSinglePromotion(req, res) {
  const promotionId = req.promotionId;
  const { role } = req.user;

  try {
    const promotion = await PromotionService.retrieveSinglePromotion(
      role,
      promotionId,
    );
    res.status(200).json(promotion);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
}

async function updateSinglePromotion(req, res) {
  const promotionId = req.promotionId;
  const {
    name,
    description,
    type,
    startTime,
    endTime,
    minSpending,
    rate,
    points,
  } = req.body;

  if (name && typeof name !== "string")
    return res
      .status(400)
      .json({ error: "Bad Request: name must be a string" });
  if (description && typeof description !== "string")
    return res
      .status(400)
      .json({ error: "Bad Request: description must be a string" });
  if (
    type &&
    (typeof type !== "string" || (type !== "automatic" && type !== "onetime"))
  )
    return res
      .status(400)
      .json({ error: "Bad Request: type must be a string" });
  if (
    startTime &&
    (typeof startTime !== "string" || !isInISODateString(startTime))
  )
    return res.status(400).json({
      error: "Bad Request: startTime must be a valid ISO date string",
    });
  if (endTime && (typeof endTime !== "string" || !isInISODateString(endTime)))
    return res
      .status(400)
      .json({ error: "Bad Request: endTime must be a valid ISO date string" });
  if (minSpending && (isNaN(Number(minSpending)) || minSpending <= 0))
    return res
      .status(400)
      .json({ error: "Bad Request: minSpending must be a number" });
  if (rate && (isNaN(Number(rate)) || rate <= 0))
    return res
      .status(400)
      .json({ error: "Bad Request: rate must be a number" });
  if (
    points &&
    (isNaN(Number(points)) || !Number.isInteger(Number(points)) || points <= 0)
  )
    return res
      .status(400)
      .json({ error: "Bad Request: points must be an integer" });

  const currentTime = new Date();
  if (startTime && new Date(startTime) < currentTime) {
    return res
      .status(400)
      .json({ error: "Bad Request: startTime must be in the future" });
  }
  if (endTime && new Date(endTime) < currentTime) {
    return res
      .status(400)
      .json({ error: "Bad Request: endTime must be in the future" });
  }
  if (endTime && startTime && new Date(endTime) <= new Date(startTime)) {
    return res
      .status(400)
      .json({ error: "Bad Request: endTime must be after startTime" });
  }

  try {
    const updatedPromotion = await PromotionService.updateSinglePromotion(
      promotionId,
      name,
      description,
      type,
      startTime,
      endTime,
      minSpending,
      rate,
      points,
    );
    res.status(200).json(updatedPromotion);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
}

async function deleteSinglePromotion(req, res) {
  const promotionId = req.promotionId;

  try {
    await PromotionService.deleteSinglePromotion(promotionId);
    res.status(204).send();
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
}

module.exports = {
  createPromotion,
  retrievePromotion,
  retrieveSinglePromotion,
  updateSinglePromotion,
  deleteSinglePromotion,
};
