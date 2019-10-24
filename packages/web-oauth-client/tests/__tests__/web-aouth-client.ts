import { WebOAuthClient } from '../../src';

const API_TOKEN = 'api token';
const WORKSPACE_ID = 'workspace id';

describe('ApiTokenClient', () => {
  it("Throws an error if authorize method haven't provided", () => {
    expect(() => {
      // @ts-ignore
      const temp = new WebOAuthClient();
    }).toThrow('Missing parameter: authorize');
  });

  // tslint:disable-next-line:only-arrow-functions
  const authorizeFn = jest.fn(function () {
    return 'login'
  });

  const logoutFn = jest.fn(function(this: WebOAuthClient) {
    this.purgeState();
    return 'logout'
  });

  const authClient = new WebOAuthClient({ authorize: authorizeFn, logout: logoutFn });

  it('As a developer, I can call authorize', async () => {
    expect(authClient.authorize()).toBe('login');
  });

  it("As a developer, I can set auth state", async () => {
    authClient.setState({
      token: API_TOKEN,
      workspaceId: WORKSPACE_ID,
    });

    expect(authClient.getState()).toEqual({
      token: API_TOKEN,
      workspaceId: WORKSPACE_ID,
    });
  });

  it("As a developer, I can check authorize", async () => {
    expect(authClient.checkIsAuthorized()).toBe(true);
  });

  it("As a developer, I can purge auth state", async () => {
    authClient.purgeState();

    expect(authClient.getState()).toEqual({});
  });

  it('As a developer, I can logout', async () => {
    authClient.setState({
      token: API_TOKEN,
    });

    expect(authClient.logout()).toBe('logout');
    expect(authClient.getState()).toEqual({});
    expect(authClient.checkIsAuthorized()).toBe(false);
  });
});
