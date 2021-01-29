import React from 'react';
import * as renderer from 'react-test-renderer';

import { FileInput } from '../../src';

let mockOnUploadDone: any = null;
let mocClient: any = null;

jest.mock('@apollo/client/react/hoc', () => {
  const client = {
    query: jest.fn(() => {
      mocClient = client;

      return {
        data: {
          fileUploadInfo: {
            apikey: 'apikey',
            policy: 'policy',
            signature: 'signature',
            path: 'path',
          },
        },
      };
    }),
  };

  return {
    withApollo: (BaseComponent: any) => (props: any) => <BaseComponent {...props} client={client} />,
  };
});

jest.mock('filestack-js', () => {
  const picker = jest.fn(({ onUploadDone }) => ({
    open: () => {
      mockOnUploadDone = onUploadDone;
    },
  }));

  return {
    mock_picker: picker,
    init: () => ({
      picker,
      session: {
        policy: 'policy-key',
        signature: 'signature-key',
      },
    }),
  };
});

const filestack = require('filestack-js'); // tslint:disable-line

beforeEach(() => {
  jest.clearAllMocks();
});

describe('should call onChange when file is uploaded', () => {
  it('for single file input', async () => {
    const renderFileInputView: any = jest.fn(() => null);
    const onChange: any = jest.fn();

    renderer.create(<FileInput onChange={onChange}>{renderFileInputView}</FileInput>);

    expect(renderFileInputView).toHaveBeenCalledTimes(1);

    await renderFileInputView.mock.calls[0][0].pick();

    expect(mocClient.query).toHaveBeenCalledTimes(1);
    expect(mocClient.query.mock.calls[0]).toMatchSnapshot();

    const originalFile = new File([''], 'filename');

    await mockOnUploadDone({
      filesUploaded: [
        {
          handle: 'handle',
          filename: 'filename',
          originalFile,
          url: 'https://url.com/handle',
          mimetype: 'application/pdf',
        },
      ],
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toEqual({
      fileId: 'handle',
      filename: 'filename',
      public: false,
      downloadUrl: 'https://url.com/security=p:policy-key,s:signature-key/handle',
      mimetype: 'application/pdf',
    });
    expect(onChange.mock.calls[0][1]).toEqual(originalFile);
  });

  it('for single file input with public modifier', async () => {
    const renderFileInputView: any = jest.fn(() => null);
    const onChange = jest.fn();

    renderer.create(
      <FileInput onChange={onChange} public={true}>
        {renderFileInputView}
      </FileInput>,
    );

    expect(renderFileInputView).toHaveBeenCalledTimes(1);

    await renderFileInputView.mock.calls[0][0].pick();

    expect(mocClient.query).toHaveBeenCalledTimes(1);
    expect(mocClient.query.mock.calls[0]).toMatchSnapshot();

    const originalFile = new File([''], 'filename');

    await mockOnUploadDone({
      filesUploaded: [
        {
          handle: 'handle',
          filename: 'filename',
          originalFile,
          url: 'https://url.com/handle',
          mimetype: 'application/pdf',
        },
      ],
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toEqual({
      fileId: 'handle',
      filename: 'filename',
      public: true,
      downloadUrl: 'https://url.com/security=p:policy-key,s:signature-key/handle',
      mimetype: 'application/pdf',
    });
    expect(onChange.mock.calls[0][1]).toEqual(originalFile);
  });

  it('for multiple files input', async () => {
    const renderFileInputView: any = jest.fn(() => null);
    const onChange = jest.fn();

    renderer.create(
      <FileInput onChange={onChange} maxFiles={3}>
        {renderFileInputView}
      </FileInput>,
    );

    expect(renderFileInputView).toHaveBeenCalledTimes(1);

    await renderFileInputView.mock.calls[0][0].pick();

    expect(mocClient.query).toHaveBeenCalledTimes(1);
    expect(mocClient.query.mock.calls[0]).toMatchSnapshot();

    const originalFile1 = new File([''], 'filename1');
    const originalFile2 = new File([''], 'filename2');
    const originalFile3 = new File([''], 'filename3');

    await mockOnUploadDone({
      filesUploaded: [
        { handle: 'handle1', filename: 'filename1', originalFile: originalFile1, url: 'https://url.com/handle1' },
        { handle: 'handle2', filename: 'filename2', originalFile: originalFile2, url: 'https://url.com/handle2' },
        { handle: 'handle3', filename: 'filename3', originalFile: originalFile3, url: 'https://url.com/handle3' },
      ],
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toEqual([
      {
        fileId: 'handle1',
        filename: 'filename1',
        public: false,
        downloadUrl: 'https://url.com/security=p:policy-key,s:signature-key/handle1',
      },
      {
        fileId: 'handle2',
        filename: 'filename2',
        public: false,
        downloadUrl: 'https://url.com/security=p:policy-key,s:signature-key/handle2',
      },
      {
        fileId: 'handle3',
        filename: 'filename3',
        public: false,
        downloadUrl: 'https://url.com/security=p:policy-key,s:signature-key/handle3',
      },
    ]);
    expect(onChange.mock.calls[0][1]).toEqual([originalFile1, originalFile2, originalFile3]);
  });

  it('for input with custom on upload handler', async () => {
    const renderFileInputView: any = jest.fn(() => null);
    const onChange = jest.fn();

    const onUploadDone: any = (value: any) =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({ ...value, id: 'id', downloadUrl: 'downloadUrl' });
        }, 50);
      });

    renderer.create(
      <FileInput onChange={onChange} onUploadDone={onUploadDone}>
        {renderFileInputView}
      </FileInput>,
    );

    expect(renderFileInputView).toHaveBeenCalledTimes(1);

    await renderFileInputView.mock.calls[0][0].pick();

    expect(mocClient.query).toHaveBeenCalledTimes(1);
    expect(mocClient.query.mock.calls[0]).toMatchSnapshot();

    await mockOnUploadDone({ filesUploaded: [{ handle: 'handle', filename: 'filename' }] });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toEqual({
      fileId: 'handle',
      filename: 'filename',
      id: 'id',
      downloadUrl: 'downloadUrl',
      public: false,
    });
  });
});

describe('FileInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows to pass custom options to pick method', async () => {
    const renderFileInputView: any = jest.fn(() => null);

    renderer.create(<FileInput>{renderFileInputView}</FileInput>);

    await renderFileInputView.mock.calls[0][0].pick({
      accept: ['image/*'],
      fromSources: ['dropbox'],
    });

    expect(filestack.mock_picker).toHaveBeenCalledWith({
      exposeOriginalFile: true,
      onUploadDone: expect.any(Function),
      storeTo: {
        path: 'path',
      },
      maxFiles: 1,
      accept: ['image/*'],
      fromSources: ['dropbox'],
    });
  });

  it("doesn't allow to rewrite maxFiles and onUploadDone options", async () => {
    const renderFileInputView: any = jest.fn(() => null);

    renderer.create(<FileInput maxFiles={3}>{renderFileInputView}</FileInput>);

    await renderFileInputView.mock.calls[0][0].pick({
      accept: ['image/*'],
      fromSources: ['dropbox'],
      maxFiles: 2,
      onUploadDone: 'not function',
    });

    expect(filestack.mock_picker).toHaveBeenCalledWith({
      exposeOriginalFile: true,
      onUploadDone: expect.any(Function),
      storeTo: {
        path: 'path',
      },
      maxFiles: 3,
      accept: ['image/*'],
      fromSources: ['dropbox'],
    });
  });
});
