function validRetrieveBody(req) {
    const { promotionId, type, relatedId, amount, operator, page, limit } =
        req.query;

    // Validate promotionId if provided
    if (promotionId && !Number.isInteger(Number(promotionId))) {
        return false;
    }

    // Check dependencies: relatedId requires type, amount requires operator, and vice versa
    if ((relatedId && !type) || (amount && !operator) || (!amount && operator)) {
        return false;
    }

    const relatedIdNum = relatedId ? Number(relatedId) : null;
    const amountNum = amount ? Number(amount) : null;

    // Validate individual fields
    if (
        (relatedId && !Number.isInteger(relatedIdNum)) ||
        (type && typeof type !== "string") ||
        (amount && !Number.isInteger(amountNum)) ||
        (operator && !["gte", "lte"].includes(operator))
    ) {
        return false;
    }

    // Validate pagination
    if (
        (page && !Number.isInteger(Number(page))) ||
        (limit && !Number.isInteger(Number(limit)))
    ) {
        return false;
    }

    return true;
}

module.exports = { validRetrieveBody };