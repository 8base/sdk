//@flow

import { Observable } from 'apollo-link';
import { createFile } from '../../src/utils/createFile';

const XHRopen = jest.fn();

const XHRsend = jest.fn();

class XMLHttpRequest {
  constructor() {
    this.open = XHRopen;
    this.send = XHRsend;

    this.send.mockImplementation(() => {
      this.readyState = 4;
      this.status = 200;
      this.onreadystatechange();
    });
  }

  open: (any) => any;

  send: (any) => any;

  readyState: number;

  status: number;

  onreadystatechange: (any) => any;
}

global.XMLHttpRequest = XMLHttpRequest;

describe(
  'As a developer i can use createFile utility to create file relation and upload file to server',
  () => {
    const file = new File([], '');
    const fileMeta = {};
    const uploadUrl = 'test.domain.com';
    const response = {
      data: {
        fileCreate: {
          id: '1',
          fileId: '',
          filename: '',
          uploadUrl,
        },
      },
      errors: {
      },
    };
    const errorResponse = {
      data: {},
      errors: {
        message: 'error',
      },
    };
    const mutate = () => Observable.of(response);
    const errorMutate = () => Observable.of(errorResponse);

    it('it sends file to uploadUrl', async () => {
      const form = new FormData();
      form.append('file', file);

      await createFile({ file, fileMeta }, mutate);

      expect(XHRopen).toHaveBeenCalledWith('POST', uploadUrl, true);
      expect(XHRsend).toHaveBeenCalledWith(form);
    });

    it('resolves created file', async () => {
      const createdFile = await createFile({ file, fileMeta }, mutate);

      expect(createdFile).toBe(response.data.fileCreate);
    });

    it('rejects response on mutation error', async () => {
      try {
        await createFile({ file, fileMeta }, errorMutate);
      } catch (error) {
        expect(error).toBe(errorResponse);
      }
    });
  },
);
