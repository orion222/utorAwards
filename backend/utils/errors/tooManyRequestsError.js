class TooManyRequestsError extends Error {
  constructor(message = "Too Many Requests") {
    super(message);
    this.name = "TooManyRequestsError";
    this.statusCode = 429;

    Object.setPrototypeOf(this, TooManyRequestsError.prototype);
  }
}

module.exports = TooManyRequestsError;
