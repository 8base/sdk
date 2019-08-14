export const SampleAuthClient: any = function() {
  let authState: any = {};

  const purgeAuthState = jest.fn(async () => {
    authState = {};
  });
  const setAuthState = jest.fn(async state => {
    authState = state;
  });
  const getAuthState = jest.fn(async () => {
    return authState;
  });
  const checkIsAuthorized = jest.fn(async () => {
    return !!authState.token;
  });

  // @ts-ignore
  this.purgeAuthState = purgeAuthState;
  // @ts-ignore
  this.setAuthState = setAuthState;
  // @ts-ignore
  this.getAuthState = getAuthState;
  // @ts-ignore
  this.checkIsAuthorized = checkIsAuthorized;
};
