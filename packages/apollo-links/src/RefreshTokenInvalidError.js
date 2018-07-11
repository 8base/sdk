//@flow

class RefreshTokenInvalidError extends Error {
  constructor() {
    super('Can\'t refresh token.');
  }
}

export { RefreshTokenInvalidError };
