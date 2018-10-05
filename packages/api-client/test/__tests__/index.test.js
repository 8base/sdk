import gql from 'graphql-tag';
import errorCodes from '@8base/error-codes';
import nock from 'nock';

import { Client } from '../../src';

beforeEach(() => {
  nock.cleanAll();
});

it('As a developer, I can create client and send request.', async () => {
  const requestPromise = mockRequest('https://api.test.8base.com');

  const client = new Client('https://api.test.8base.com');

  await client.request('query { companyName }');

  const { body } = await requestPromise;

  expect(body).toMatchSnapshot();
});

it('As a developer, I can create client and send request with variables.', async () => {
  const requestPromise = mockRequest('https://api.test.8base.com');

  const client = new Client('https://api.test.8base.com');

  await client.request('query { companyName }', { variable: 2 });

  const { body } = await requestPromise;

  expect(body).toMatchSnapshot();
});

it('As a developer, I can create client, set API credentials and send request.', async () => {
  const requestPromise = mockRequest('https://api.test.8base.com');

  const client = new Client('https://api.test.8base.com');

  client.setIdToken('idToken');
  client.setWorkspaceId('workspaceId');

  await client.request('query { companyName }');

  const request = await requestPromise;

  expect(request).toMatchSnapshot();
});

it('As a developer, I can send queries with graphql tag.', async () => {
  const requestPromise = mockRequest('https://api.test.8base.com');

  const client = new Client('https://api.test.8base.com');

  await client.request(gql`query { companyName }`);

  const request = await requestPromise;

  expect(request).toMatchSnapshot();
});

it('When client receive token expired error, it should refresh token and repeat my request.', async () => {
  mockRequest('https://api.test.8base.com', 502, {
    errors: [
      {
        code: errorCodes.TokenExpiredErrorCode,
        message: 'Token expired',
        details: {
          token: 'jwt expired',
        },
      },
    ],
  });

  const refreshTokenRequestPromise = mockRequest('https://api.test.8base.com', 200, {
    data: {
      userRefreshToken: {
        refreshToken: 'newRefreshToken',
        idToken: 'newIdToken',
      },
    },
  });

  const requestPromise = mockRequest('https://api.test.8base.com');

  const client = new Client('https://api.test.8base.com');

  client.setIdToken('idToken');
  client.setWorkspaceId('workspaceId');
  client.setEmail('test@site.com');

  await client.request('query { companyName }');

  const refreshTokenRequest = await refreshTokenRequestPromise;

  expect(refreshTokenRequest).toMatchSnapshot();

  const request = await requestPromise;

  expect(request).toMatchSnapshot();
});

it('When client receive other errors, it should throw that error.', async () => {
  mockRequest('https://api.test.8base.com', 502, {
    errors: [{
      code: errorCodes.InvalidTokenErrorCode,
    }],
    data: null,
  });

  mockRequest('https://api.test.8base.com');

  const client = new Client('https://api.test.8base.com');

  client.setIdToken('idToken');
  client.setWorkspaceId('workspaceId');
  client.setEmail('test@site.com');

  let error = null;

  try {
    await client.request(gql`query { companyName }`);
  } catch (err) {
    error = err;
  }

  expect(error.response).toMatchSnapshot();
});

it('When client receive network errors, it should throw that error.', async () => {
  mockRequest('https://api.test.8base.com', 502, {
    foo: 'bar',
  });

  const client = new Client('https://api.test.8base.com');

  client.setIdToken('idToken');
  client.setWorkspaceId('workspaceId');
  client.setEmail('test@site.com');

  let error = null;

  try {
    await client.request(gql`query { companyName }`);
  } catch (err) {
    error = err;
  }

  expect(error).toMatchSnapshot();
});

it('When client receive refresh token expired error, it should throw cant refresh token error.', async () => {
  mockRequest('https://api.test.8base.com', 502, {
    errors: [
      {
        code: errorCodes.TokenExpiredErrorCode,
        message: 'Token expired',
        details: {
          token: 'jwt expired',
        },
      },
    ],
  });

  const refreshTokenRequestPromise = mockRequest('https://api.test.8base.com', 502, {
    data: {
      userRefreshToken: null,
    },
    errors: [
      {
        message: 'Refresh Token has expired',
        locations: [
          {
            line: 2,
            column: 3,
          },
        ],
        path: [
          'userRefreshToken',
        ],
        code: errorCodes.TokenExpiredErrorCode,
        details: {
          refreshToken: 'Refresh Token has expired',
        },
      },
    ],
  });

  const client = new Client('https://api.test.8base.com');

  client.setIdToken('idToken');
  client.setWorkspaceId('workspaceId');
  client.setEmail('test@site.com');

  let error = null;

  try {
    await client.request(gql`query { companyName }`);
  } catch (err) {
    error = err;
  }

  await refreshTokenRequestPromise;

  expect(error).toMatchSnapshot();
});
