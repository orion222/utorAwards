function validRetrieveBody(req) {
    const { promotionId, type, relatedId, amount, operator, page, limit } =
        req.query;

    // Validate promotionId if provided
    if (promotionId && !Number.isInteger(Number(promotionId))) {
        return false;
    }

    // Check dependencies: relatedId requires type, amount requires operator, and vice versa
    if ((relatedId && !type) || (!amount && operator)) {
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

function generateFakeName() {
  const adjectives = [
    "Blue", "Red", "Aqua", "Pink", "Grey", "Dark", "Teal", "Gold",
  ]; 

  const animals = [
    "Fox", "Cat", "Dog", "Bear", "Hawk", "Lion", "Fish", "Cow",
  ];

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const digit = Math.floor(Math.random() * 10);

  const name = adj + animal + digit;

  return name;
}

module.exports = { validRetrieveBody, generateFakeName };