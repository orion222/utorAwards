class NotAllowedError extends Error {
  constructor(message = "Method Not Allowed") {
    super(message);
    this.name = "NotAllowedError";
    this.statusCode = 405;

    Object.setPrototypeOf(this, NotAllowedError.prototype);
  }
}

module.exports = NotAllowedError;
