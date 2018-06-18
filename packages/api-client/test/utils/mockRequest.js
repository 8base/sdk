import nock from 'nock';

function mockRequest(endpoint, response = { data: {}}) {
  let requestBody = null;

  return new Promise((resolve) => {
    nock(endpoint)
      .post('/', (body) => {
        requestBody = body;

        return true;
      })
      .reply(200, function reply() {
        resolve({
          body: requestBody,
          headers: this.req.headers,
        });

        return response;
      });
  });
}

export { mockRequest };
