function validRetrieveBody(req) {
  const { promotionId, type, relatedId, amount, operator, page, limit } =
    req.query;

  // createdBy is utorid
  if (promotionId && typeof promotionId !== "number") {
    return false;
  }

  if ((relatedId && !type) || (amount && !operator) || (!amount && operator))
    return false;

  const relatedIdNum = relatedId ? Number(relatedId) : null;
  const amountNum = amount ? Number(amount) : null;

  if (
    (relatedId && !Number.isInteger(relatedIdNum)) ||
    (type && typeof type !== "string") ||
    (amount && !Number.isInteger(amountNum)) ||
    (operator && operator !== "gte" && operator !== "lte")
  ) {
    return false;
  }

  if (
    (page && !Number.isInteger(Number(page))) ||
    (limit && !Number.isInteger(Number(limit)))
  )
    return false;

  return true;
}

module.exports = { validRetrieveBody };
