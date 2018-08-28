import gql from 'graphql-tag';
import errorCodes from '@8base/error-codes';

import { Client } from '../../src';

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
  client.setAccountId('accountId');

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
    errors: [{
      code: errorCodes.TokenExpiredErrorCode,
    }],
    data: null,
  });

  mockRequest('https://api.test.8base.com', 200, {
    data: {
      system: {
        userRefreshToken: {
          refreshToken: 'newRefreshToken',
          idToken: 'newIdToken',
        },
      },
    },
  });

  const requestPromise = mockRequest('https://api.test.8base.com');

  const client = new Client('https://api.test.8base.com');

  client.setIdToken('idToken');
  client.setAccountId('accountId');
  client.setEmail('test@site.com');

  await client.request('query { companyName }');

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
  client.setAccountId('accountId');
  client.setEmail('test@site.com');

  let error = null;

  try {
    await client.request(gql`query { companyName }`);
  } catch (err) {
    error = err;
  }

  expect(error.response).toMatchSnapshot();
});
