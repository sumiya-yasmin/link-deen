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

export class UserSoftDeletedError extends Error {
  constructor(deletionScheduledAt) {
    super('User is soft deleted');
    this.name = 'UserSoftDeletedError';
    this.restoreAvailableUntil = deletionScheduledAt;
  }
}
