import gql from 'graphql-tag';
import { Client } from '../../src';

let requestPromise = null;

beforeEach(async () => {
  requestPromise = mockRequest('https://api.test.8base.com');
});

it('As a developer, I can create client and send request.', async () => {
  const client = new Client('https://api.test.8base.com');

  await client.request('query { companyName }');

  const { body } = await requestPromise;

  expect(body).toMatchSnapshot();
});

it('As a developer, I can create client and send request with variables.', async () => {
  const client = new Client('https://api.test.8base.com');

  await client.request('query { companyName }', { variable: 2 });

  const { body } = await requestPromise;

  expect(body).toMatchSnapshot();
});

it('As a developer, I can create client, set API credentials and send request.', async () => {
  const client = new Client('https://api.test.8base.com');

  client.setIdToken('idToken');
  client.setAccountId('accountId');

  await client.request('query { companyName }');

  const request = await requestPromise;

  expect(request).toMatchSnapshot();
});

it('As a developer, I can send queries with graphql tag.', async () => {
  const client = new Client('https://api.test.8base.com');

  await client.request(gql`query { companyName }`);

  const request = await requestPromise;

  expect(request).toMatchSnapshot();
});
