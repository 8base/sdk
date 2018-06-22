// @flow

import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { createApolloClient } from '../../src';

jest.mock('apollo-client');
jest.mock('apollo-link');
jest.mock('apollo-cache-inmemory');


describe('As a Developer, I can create 8base compability Apollo Client', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should create Apollo Client with empty parameters', () => {
    const client = createApolloClient({})();

    expect(ApolloClient).toBeCalled();
    expect(client).toBeInstanceOf(ApolloClient);
    expect(InMemoryCache).toBeCalled();
    expect(ApolloLink.from).toBeCalledWith([]);

    expect(ApolloClient.mock.calls[0][0].cache).not.toBeUndefined();
  });

  it('should create Apollo Client with custom json scema', () => {
    createApolloClient({})({ __schema: 42 });

    expect(IntrospectionFragmentMatcher).toBeCalledWith({
      introspectionQueryResultData: { __schema: 42 },
    });
  });

  it('should create Apollo Client with custom links', () => {
    createApolloClient({ links: [42, 43] })();

    expect(ApolloLink.from).toBeCalledWith([42, 43]);
  });

  it('should pass default Apollo Client parameters', () => {
    const apolloclientParams = {
      connectToDevTools: true,
      defaultOptions: { opt: 42 },
      queryDeduplication: false,
      ssrForceFetchDelay: 666,
      ssrMode: 'some-mode',
    };

    createApolloClient({ ...apolloclientParams })();

    const calledObject = ApolloClient.mock.calls[0][0];

    expect(calledObject.connectToDevTools).toBe(apolloclientParams.connectToDevTools);
    expect(calledObject.defaultOptions).toEqual(apolloclientParams.defaultOptions);
    expect(calledObject.queryDeduplication).toBe(apolloclientParams.queryDeduplication);
    expect(calledObject.ssrForceFetchDelay).toBe(apolloclientParams.ssrForceFetchDelay);
    expect(calledObject.ssrMode).toBe(apolloclientParams.ssrMode);
  });
});
