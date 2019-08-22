import { ApiTokenAuthClient } from '../../src';

const API_TOKEN = 'api token';
const ANOTHER_API_TOKEN = 'another api token';
const WORKSPACE_ID = 'workspace id';

describe('ApiTokenClient', () => {
  it("Throws an error if apiToken haven't provided", () => {
    expect(() => {
      // @ts-ignore
      const temp = new ApiTokenAuthClient();
    }).toThrow('Missing parameter: apiToken');
  });

  const authClient = new ApiTokenAuthClient({ apiToken: API_TOKEN });

  it('As a developer, I can get api token from the state', async () => {
    expect(authClient.getState()).toEqual({
      token: API_TOKEN,
    });
  });

  it("As a developer, I can't rewrite token in the state", async () => {
    authClient.setState({
      token: ANOTHER_API_TOKEN,
      workspaceId: WORKSPACE_ID,
    });

    expect(authClient.getState()).toEqual({
      token: API_TOKEN,
      workspaceId: WORKSPACE_ID,
    });
  });

  it("As a developer, I can't purge token from the state", async () => {
    authClient.purgeState();

    expect(authClient.getState()).toEqual({
      token: API_TOKEN,
    });
  });

  it("ApiTokenClient's instance is always authorized", async () => {
    expect(authClient.checkIsAuthorized()).toBe(true);
  });
});
