import { ApiTokenClient } from '../../src';

describe('ApiTokenClient', () => {
  const API_TOKEN = 'api-token';
  const ANOTHER_API_TOKEN = 'another-api-token';
  const WORKSPACE_ID = 'workspace-id';

  const apiTokenClient = new ApiTokenClient({
    apiToken: API_TOKEN,
  });

  it('As a developer, i can get api token by getAuthState', () => {
    expect(apiTokenClient.getAuthState()).toEqual({
      token: API_TOKEN,
    });
  });

  it('As a developer, i can\'t rewrite apiToken state param', () => {
    apiTokenClient.setAuthState({
      token: ANOTHER_API_TOKEN,
      workspaceId: WORKSPACE_ID,
    });

    expect(apiTokenClient.getAuthState()).toEqual({
      token: API_TOKEN,
      workspaceId: WORKSPACE_ID,
    });
  });

  it('As a developer, i can\'t purge apiToken state param', () => {
    apiTokenClient.purgeAuthState();

    expect(apiTokenClient.getAuthState()).toEqual({
      token: API_TOKEN,
    });
  });

  it('ApiTokenClient\'s instance is always authorized', () => {
    expect(apiTokenClient.checkIsAuthorized()).toBe(true);
  });
});

