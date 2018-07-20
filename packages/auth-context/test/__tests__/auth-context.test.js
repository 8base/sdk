// @flow

import React from 'react';
import TestRenderer from 'react-test-renderer';

import { AuthContext } from '../../src';

type StubComponentProps = {
  isAuthorized: boolean,
};

const StubComponent = ({ isAuthorized }: StubComponentProps) => (
  <div>
    { isAuthorized ? 'I am authorized :)' : 'I am not authorized :(' }
  </div>
);

const getTestInstance = ({ accountId, idToken }) => {
  const testRenderer = TestRenderer.create(
    <AuthContext.Provider idToken={ idToken } accountId={ accountId } >
      <AuthContext.Consumer>
        {
          ({ isAuthorized }) => (
            <StubComponent isAuthorized={ isAuthorized } />
          )
        }
      </AuthContext.Consumer>
    </AuthContext.Provider>,
  );
  const testInstance = testRenderer.root;

  return testInstance;
};

describe('As a developer, i can use AuthContext to get authorization state in any place of react tree', () => {
  it('sets isAuthorized=true if there are valid accountId and idToken', () => {
    const accountId = 'some account id';
    const idToken = 'some id token';
    const testInstance = getTestInstance({ accountId, idToken });

    expect(testInstance.findByType(StubComponent).props.isAuthorized).toBe(true);
  });

  it('sets isAuthorized=false if there is an invalid prop', () => {
    const accountId = 'some account id';
    const idToken = undefined;
    const testInstance = getTestInstance({ accountId, idToken });

    expect(testInstance.findByType(StubComponent).props.isAuthorized).toBe(false);
  });
});
