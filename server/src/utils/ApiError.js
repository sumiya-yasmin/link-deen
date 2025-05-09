export class ApiError extends Error{
    constructor(message) {
        super(message);
        this.name = 'ApiError';
    }
}

export class UserNotFoundError extends ApiError {
  constructor(message = "Email not registered") {
    super(message);
    this.name = "UserNotFoundError";
  }
}

export class InvalidPasswordError extends ApiError {
  constructor(message = "Incorrect password") {
    super(message);
    this.name = "InvalidPasswordError";
  }
}