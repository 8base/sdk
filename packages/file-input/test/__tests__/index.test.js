import React from 'react';
import renderer from 'react-test-renderer';

import { FileInput } from '../../src';

let mock_onUploadDone = null;
let mock_client = null;

jest.mock('react-apollo', () => {
  const client = {
    query: jest.fn(() => {
      mock_client = client;

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
    withApollo: (BaseComponent) => (props) => <BaseComponent { ...props } client={ client } />,
  };
});

jest.mock('filestack-js', () => ({
  init: () => ({
    picker: ({ onUploadDone }) => ({
      open: () => {
        mock_onUploadDone = onUploadDone;
      },
    }),
    session: {},
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('should call onChange when file is uploaded', async () => {
  it('for single file input', async() => {
    const renderFileInputView = jest.fn(() => null);
    const onChange = jest.fn();

    renderer.create(
      <FileInput onChange={ onChange }>
        { renderFileInputView }
      </FileInput>,
    );

    expect(renderFileInputView).toHaveBeenCalledTimes(1);

    await renderFileInputView.mock.calls[0][0].pick();

    expect(mock_client.query).toHaveBeenCalledTimes(1);
    expect(mock_client.query.mock.calls[0]).toMatchSnapshot();

    await mock_onUploadDone({ filesUploaded: [{ handle: 'handle', filename: 'filename' }] });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toEqual({ fileId: 'handle', filename: 'filename' });
  });

  it('for multiple files input', async() => {
    const renderFileInputView = jest.fn(() => null);
    const onChange = jest.fn();

    renderer.create(
      <FileInput onChange={ onChange } maxFiles={ 3 }>
        { renderFileInputView }
      </FileInput>,
    );

    expect(renderFileInputView).toHaveBeenCalledTimes(1);

    await renderFileInputView.mock.calls[0][0].pick();

    expect(mock_client.query).toHaveBeenCalledTimes(1);
    expect(mock_client.query.mock.calls[0]).toMatchSnapshot();

    await mock_onUploadDone({
      filesUploaded: [
        { handle: 'handle1', filename: 'filename1' },
        { handle: 'handle2', filename: 'filename2' },
        { handle: 'handle3', filename: 'filename3' },
      ],
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toEqual(
      [
        { fileId: 'handle1', filename: 'filename1' },
        { fileId: 'handle2', filename: 'filename2' },
        { fileId: 'handle3', filename: 'filename3' },
      ],
    );
  });

  it('for input with custom on upload handler', async() => {
    const renderFileInputView = jest.fn(() => null);
    const onChange = jest.fn();

    const onUploadFinish = (value) => new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...value, id: 'id', downloadUrl: 'downloadUrl' });
      }, 50);
    });

    renderer.create(
      <FileInput onChange={ onChange } onUploadFinish={ onUploadFinish }>
        { renderFileInputView }
      </FileInput>,
    );

    expect(renderFileInputView).toHaveBeenCalledTimes(1);

    await renderFileInputView.mock.calls[0][0].pick();

    expect(mock_client.query).toHaveBeenCalledTimes(1);
    expect(mock_client.query.mock.calls[0]).toMatchSnapshot();

    await mock_onUploadDone({ filesUploaded: [{ handle: 'handle', filename: 'filename' }] });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toEqual({ fileId: 'handle', filename: 'filename', id: 'id', downloadUrl: 'downloadUrl' });
  });
});

