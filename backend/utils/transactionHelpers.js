const { TransactionType } = require('@prisma/client');

// Controller helpers
function validPurchaseBody(req) {
    const { spent } = req.body;

    const spentNum = Number(spent);

    return spent && !Number.isNaN(spentNum) && spentNum >= 0;
}

function validAdjustmentBody(req) {
    const { amount, relatedId } = req.body;

    const relatedIdNum = Number(relatedId);

    return Number.isInteger(Number(amount)) && Number.isInteger(relatedIdNum) && relatedIdNum > 0;
}

function validRetrieveBody(req) {
    const { name, createdBy, suspicious, promotionId, type, relatedId, amount, operator, page, limit } = req.query;
    const suspiciousBool = suspicious === 'true' ? true : suspicious === 'false' ? false : null;
    const promotionIdNum = promotionId ? Number(promotionId) : null;

    // name can be user's name or utorid
    // createdBy is utorid
    if ((name && typeof name !== "string") || 
        (createdBy && (typeof createdBy !== "string" || createdBy.length < 7 || createdBy.length > 8)) || 
        suspiciousBool || 
        (promotionId && Number.isNaN(promotionIdNum))) {
            return false;
        }

    if ((relatedId && !type) || (amount && !operator) || (!amount && operator)) return false;

    const relatedIdNum = relatedId ? Number(relatedId) : null;
    const amountNum = amount ? Number(amount) : null;

    if ((relatedId && !Number.isInteger(relatedIdNum)) || 
        (type && typeof type !== "string") ||
        (amount && !Number.isInteger(amountNum)) ||
        (operator && operator !== "gte" && operator !== "lte")) {
            return false
        }

    if (type && !TransactionType[type]) return false;

    const pageNum = Number(page);
    const limitNum = Number(limit);

    if ((page && (!Number.isInteger(pageNum) || pageNum <= 0)) || (limit && (!Number.isInteger(limitNum) || limitNum <= 0))) return false;

    return true;
}

function mapByTransactionType(transactionList) {
    return transactionList.map(transaction => {
        const initialObj = {
            id: transaction.id,
            type: transaction.type,
            promotionIds: transaction.promotions.map(promo => {return promo.id}),
            remark: transaction.remark,
            createdBy: transaction.user.utorid
        }

        switch (transaction.type) {
            case "purchase": {
                return {
                    ...initialObj,
                    utorid: transaction.targetUser.utorid,
                    earned: transaction.amount,
                    spent: transaction.spent ?? 0,
                    suspicious: transaction.user.suspicious
                }
            }

            case "adjustment": {
                return {
                    ...initialObj,
                    utorid: transaction.targetUser.utorid,
                    amount: transaction.amount,
                    relatedId: transaction.relatedId ?? null,
                    suspicious: transaction.user.suspicious
                }
            }

            case "redemption": {
                return {
                    ...initialObj,
                    utorid: transaction.targetUser.utorid,
                    amount: transaction.amount,
                    redeemed: Math.abs(transaction.amount),
                    relatedId: transaction.processedByUser?.utorid ?? null
                }
            }

            case "transfer": {
                return {
                    ...initialObj,
                    amount: transaction.amount,
                    relatedId: transaction.user.utorid
                }
            }

            case "event": {
                return {
                    ...initialObj,
                    recipient: transaction.targetUser.utorid,
                    awarded: transaction.amount,
                    relatedId: transaction.eventInvolvedId ?? null
                }
            }

            default: {
                return {
                    ...initialObj,
                    utorid: transaction.targetUser.utorid,
                    points: transaction.amount
                }
            }
        }
    });
}

// Service helpers
function promoToPoints(amount, promotions) {
    const totalPromoPoints = promotions.reduce((acc, promo) => {
        const additionalPoints = promo.points ? promo.points : 0;
        const rateDiscount = promo.rate ? Math.round(amount * promo.rate * 100) : 0;
        return acc + additionalPoints + rateDiscount;
    }, 0);

    return totalPromoPoints;
}

function pointsConversion(total, rate = 25) {
    // Suppose total is a float with 2 decimal places
    // Always round up to the next 25 cents
    const roundedCents = Math.round(total * 100);
    const points = Math.round(roundedCents / rate);

    return points;
}

module.exports = { validAdjustmentBody, validRetrieveBody, validPurchaseBody, mapByTransactionType, promoToPoints, pointsConversion };