import * as nock from 'nock';

function mockRequest(
    endpoint: string, 
    status: number = 200, 
    response: {data: { [key: string]: any }} = { data: {}}
): Promise<any> {
  let requestBody: any = null;

  return new Promise((resolve) => {
    nock(endpoint)
      .post('/', (body: any) => {
        requestBody = body;

        return true;
      })
      .reply(status, function reply() {
        resolve({
          body: requestBody,
          headers: (<any>this).req.headers,
        });

        return response;
      });
  });
}

export { mockRequest };
