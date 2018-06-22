// @flow

import gql from 'graphql-tag';
import { createApolloClient, createApolloLinks } from '../../../src';


const uri = 'http://api.test.8base.com';

const getAuthState = () => ({
  email: 'user-name@gmail.com',
  accountId: 'account-id-bcxcvboiet',
  organizationId: 'organization-id-142',
  refreshToken: 'refresh-token-asdasdafaqwebfdhgh,dlphgkmw092y09qkefskbnq0921r',
  idToken: 'id-token-glhjkoerjhyldkmn;vjioghlblafeorhn',
});

const userQueryTag = gql`
  query userQuery{ 
    user {
      name
    }
  }
`;

const USER_QUERY_RESPONSE = {
  data: {
    user: { __typename: 'User', name: 'vasya' },
  },
};

const requestPromise = mockRequest(uri);


describe('As a Developer, I Can use 8base compability auth link', () => {

  it('should add 8base compability headers to the request', async () => {
    const authState = getAuthState();
    const client = createApolloClient({
      links: createApolloLinks({ getAuthState, uri }),
    })();

    client.query({ query: userQueryTag });
    const { headers } = await requestPromise(USER_QUERY_RESPONSE);

    expect(headers['account-id']).toEqual([authState.accountId]);
    expect(headers['organization-id']).toEqual([authState.organizationId]);
    expect(headers.authorization).toEqual([authState.idToken]);
  });

  it('should throw an error then getAuthState is not provided', async () => {
    let error = {};
    try {
      createApolloLinks({
        uri,
      });
    }
    catch (err) {
      error = err;
    }
    finally {
      expect(error.message).toBe('Excepted a getAuthState callback');
    }
  });
});

