class ExpiredError extends Error {
    constructor(message = "Transaction has expired") {
        super(message);
        this.name = 'ExpiredError';
        this.statusCode = 410;
    }
}

module.exports = ExpiredError;