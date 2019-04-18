import nock from 'nock';

type MockResponse = { data: { [key: string]: any } };

function mockRequest(
  endpoint: string,
  status: number = 200,
  response: MockResponse | ((body: any) => MockResponse) = { data: {} },
): Promise<any> {
  let requestBody: any = null;

  return new Promise(resolve => {
    nock(endpoint)
      .post('/', (body: any) => {
        requestBody = body;

        return true;
      })
      .reply(status, function reply() {
        resolve({
          body: requestBody,
          headers: (this as any).req.headers,
        });

        return typeof response === 'function' ? response(requestBody) : response;
      });
  });
}

export { mockRequest };
