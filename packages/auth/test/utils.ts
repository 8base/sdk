export const SampleAuthClient = function () {
  let authState = {};

  const purgeAuthState = jest.fn(async () => {
    authState = {};
  });
  const setAuthState = jest.fn(async (state) => {
    authState = state;
  });
  const getAuthState = jest.fn(async () => {
    return authState;
  });
  const checkIsAuthorized = jest.fn(async () => {
    return !!authState.token;
  });

  this.purgeAuthState = purgeAuthState;
  this.setAuthState = setAuthState;
  this.getAuthState = getAuthState;
  this.checkIsAuthorized = checkIsAuthorized;
};


