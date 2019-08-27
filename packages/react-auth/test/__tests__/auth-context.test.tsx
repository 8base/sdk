import React from 'react';
import TestRenderer from 'react-test-renderer';
import { IAuthClient, IAuthState } from '@8base/utils';
import { SubscribableDecorator } from '@8base/auth';

import { AuthContext, AuthProvider } from '../../src';
import { DummyAuthClient, externalAuth } from '../utils';

const TOKEN = 'some token';

type StubComponentProps = {
  auth: {
    isAuthorized: boolean;
    authClient: IAuthClient;
    authState: IAuthState;
  };
};

const NotAuthorizedComponent = () => <span>I am not authorider</span>;

const AuthorizedComponent = () => <span>I am authorized</span>;

const StubComponent = ({ auth: { isAuthorized } }: StubComponentProps) => {
  return isAuthorized ? <AuthorizedComponent /> : <NotAuthorizedComponent />;
};

describe('AuthContext', () => {
  it("Throws an error if auth client isn't decorated with publisher", () => {
    expect(() => {
      TestRenderer.create(
        // @ts-ignore
        <AuthProvider authClient={DummyAuthClient()}>
          <AuthContext.Consumer>{(auth: any) => <StubComponent auth={auth} />}</AuthContext.Consumer>
        </AuthProvider>,
      );
    }).toThrow();
  });

  const authClient = DummyAuthClient();
  const subscriableAuthClient = SubscribableDecorator.decorate(authClient);
  const testRenderer = TestRenderer.create(
    // @ts-ignore
    <AuthProvider authClient={subscriableAuthClient}>
      <AuthContext.Consumer>{(auth: any) => <StubComponent auth={auth} />}</AuthContext.Consumer>
    </AuthProvider>,
  );
  const testInstance = testRenderer.root;

  it('As a developer, I can use AuthContext to check authorization state #1', () => {
    const { children, props } = testInstance.findByType(StubComponent);

    expect(props.auth.isAuthorized).toBe(false);
    expect(props.auth.authState).toEqual({});
    expect((children[0] as any).type).toBe(NotAuthorizedComponent);
  });

  it('As a developer, I can use AuthContext to update authorization state', () => {
    const { props } = testInstance.findByType(StubComponent);

    props.auth.authClient.setState({
      token: TOKEN,
    });

    expect(authClient.setState).toHaveBeenCalledWith({
      token: TOKEN,
    });
  });

  it('As a developer, I can use AuthContext to check authorization state #2', () => {
    const { children, props } = testInstance.findByType(StubComponent);

    expect(props.auth.isAuthorized).toBe(true);
    expect(props.auth.authState).toEqual({
      token: TOKEN,
    });
    expect((children[0] as any).type).toBe(AuthorizedComponent);
  });

  it('As a developer, I can use AuthContext to clear authorization state', () => {
    const { props } = testInstance.findByType(StubComponent);

    props.auth.authClient.purgeState();

    expect(authClient.purgeState).toHaveBeenCalled();
  });

  it('As a developer, I can use AuthContext to check authorization state #3', () => {
    const { children, props } = testInstance.findByType(StubComponent);

    expect(props.auth.isAuthorized).toBe(false);
    expect(props.auth.authState).toEqual({});
    expect((children[0] as any).type).toBe(NotAuthorizedComponent);
  });
});
