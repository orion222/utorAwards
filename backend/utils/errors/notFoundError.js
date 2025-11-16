class NotFoundError extends Error {
  constructor(message = "Not Found") {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

module.exports = NotFoundError;
