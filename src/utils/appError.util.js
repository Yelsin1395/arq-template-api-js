export default class AppError extends Error {
  constructor(errorStatus, errorCode, message) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.errorStatus = parseInt(errorStatus);
    this.errorCode = errorCode;
    this.message = message;
  }
}
