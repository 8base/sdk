// @flow
import React from 'react';
import renderer from 'react-test-renderer';
import { ApolloProvider as DefaultApolloProvider } from 'react-apollo';

import { ApolloProvider } from '../../src';

jest.mock('react-apollo');

class ApolloClient {}

const uri = 'https://api.test.8base.com';

const fetchedSchema = { __schema: { types: [] }};

const fetchedPromise = new Promise(resolve => resolve({ json: () => ({ data: fetchedSchema }) }));

global.fetch = () => fetchedPromise;

describe('As a Developer, I can use Apollo Provider with fetching interfaces schema', () => {
  it('should fetch schema and pass create apollo client', async () => {
    const getClient: Function = jest.fn(() => new ApolloClient());
    const testRenderer = renderer.create(
      <ApolloProvider getClient={ getClient } uri={ uri }><span>children</span></ApolloProvider>,
    );
    const testInstance = testRenderer.root;

    await testInstance.instance.componentDidMount();

    expect(getClient).toBeCalledWith(fetchedSchema);
    expect(testInstance.findByType(DefaultApolloProvider).props.client).toBeInstanceOf(ApolloClient);
  });


  it('should call pass isLoading as a children props', async () => {
    const getClient: Function = jest.fn(() => new ApolloClient());
    const childrenFunction = jest.fn((() => <div />));
    const testRenderer = renderer.create(
      <ApolloProvider
        getClient={ getClient }
        uri={ uri }
      >
        { childrenFunction }
      </ApolloProvider>,
    );
    const testInstance = testRenderer.root;

    expect(childrenFunction.mock.calls[0][0].isLoading).toBeTruthy();

    await testInstance.instance.componentDidMount();

    expect(childrenFunction.mock.calls[1][0].isLoading).toBeFalsy();
  });
});
