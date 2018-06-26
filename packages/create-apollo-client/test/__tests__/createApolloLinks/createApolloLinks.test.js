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


describe('As a Developer, I can create apollo client with configured links ', () => {

  it('should check the apollo-client work correctly: does querie and gets the response', async () => {
    const client = createApolloClient({
      links: createApolloLinks({ getAuthState, uri }),
    })();

    client.query({ query: userQueryTag });

    const { body } = await requestPromise(USER_QUERY_RESPONSE);

    expect(body.data.user.name).toBe('vasya');
    expect(body).not.toBeUndefined();
  });
});


