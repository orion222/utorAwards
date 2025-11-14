class ForbiddenError extends Error {
    constructor(message = "Forbidden") {
        super(message);
        this.name = 'ForbiddenError';
        this.statusCode = 403;

        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}

module.exports = ForbiddenError;