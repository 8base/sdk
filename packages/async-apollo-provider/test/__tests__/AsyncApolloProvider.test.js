// @flow
import React from 'react';
import renderer from 'react-test-renderer';
import { ApolloProvider } from 'react-apollo';

import { AsyncApolloProvider } from '../../src/AsyncApolloProvider';

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
      <AsyncApolloProvider getClient={ getClient } uri={ uri }><span>children</span></AsyncApolloProvider>,
    );
    const testInstance = testRenderer.root;

    expect(testInstance.findAllByType(ApolloProvider)).toEqual([]);

    await testInstance.instance.componentDidMount();

    expect(getClient).toBeCalledWith(fetchedSchema);
    expect(testInstance.findByType(ApolloProvider).props.client).toBeInstanceOf(ApolloClient);
  });
});
