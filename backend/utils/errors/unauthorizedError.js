class UnauthorizedError extends Error {
    constructor(message = "Unauthorized") {
        super(message);
        this.name = 'UnauthorizedError';
        this.statusCode = 401;

        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}

module.exports = UnauthorizedError;