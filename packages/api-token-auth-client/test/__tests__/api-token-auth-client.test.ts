import { ApiTokenAuthClient } from '../../src';

const API_TOKEN = 'api token';
const ANOTHER_API_TOKEN = 'another api token';
const WORKSPACE_ID = 'workspace id';

describe('ApiTokenClient', () => {

  it('Throws an error if apiToken haven\'t provided', () => {
    expect(() => {
      // @ts-ignore
      new ApiTokenAuthClient({});
    }).toThrow('apiToken is required');
  });

  const authClient = new ApiTokenAuthClient({
    apiToken: API_TOKEN,
  });

  it('As a developer, i can get api token by getAuthState', async () => {
    expect(await authClient.getAuthState()).toEqual({
      token: API_TOKEN,
    });
  });

  it('As a developer, i can\'t rewrite apiToken state param', async () => {
    await authClient.setAuthState({
      token: ANOTHER_API_TOKEN,
      workspaceId: WORKSPACE_ID,
    });

    expect(await authClient.getAuthState()).toEqual({
      token: API_TOKEN,
      workspaceId: WORKSPACE_ID,
    });
  });

  it('As a developer, i can\'t purge apiToken state param', async () => {
    await authClient.purgeAuthState();

    expect(await authClient.getAuthState()).toEqual({
      token: API_TOKEN,
    });
  });

  it('ApiTokenClient\'s instance is always authorized', async () => {
    expect(await authClient.checkIsAuthorized()).toBe(true);
  });
});

