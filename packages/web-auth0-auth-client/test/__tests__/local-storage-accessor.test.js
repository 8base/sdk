import * as localStorageAccessor from '../../src/localStorageAccessor';

const TOKEN = 'test token';
const ANOTHER_TOKEN = 'another test token';
const WORKSPACE_ID = 'test workspace id';

describe('localStorageAccessor', () => {
  it('As a developer, i can set auth state', () => {
    localStorageAccessor.setAuthState({
      token: TOKEN,
    });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'auth',
      JSON.stringify({
        token: TOKEN,
      }),
    );
  });

  it('As a developer, i can get auth state', () => {
    const authState = localStorageAccessor.getAuthState();

    expect(authState).toEqual({
      token: TOKEN,
    });
  });

  it('As a developer, i can append properties to auth state', () => {
    localStorageAccessor.setAuthState({
      workspaceId: WORKSPACE_ID,
    });

    const authState = localStorageAccessor.getAuthState();

    expect(authState).toEqual({
      token: TOKEN,
      workspaceId: WORKSPACE_ID,
    });
  });

  it('As a developer, i can rewrite properties in auth state', () => {
    localStorageAccessor.setAuthState({
      token: ANOTHER_TOKEN,
    });

    const authState = localStorageAccessor.getAuthState();

    expect(authState).toEqual({
      token: ANOTHER_TOKEN,
      workspaceId: WORKSPACE_ID,
    });
  });

  it('As a developer, i can clear auth state', () => {
    localStorageAccessor.purgeAuthState();

    const authState = localStorageAccessor.getAuthState();

    expect(authState).toEqual({});
  });
});

