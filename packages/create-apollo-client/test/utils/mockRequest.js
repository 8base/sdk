import nock from 'nock';

function mockRequest(endpoint) {
  return (responseBody = { data: {}}) => new Promise((resolve) => {
    nock(endpoint)
      .post('/', () => {
        return true;
      })
      .reply(200, function reply() {
        const response = responseBody;

        resolve({
          body: response,
          headers: this.req.headers,
        });

        return response;
      });
  });
}

export { mockRequest };
