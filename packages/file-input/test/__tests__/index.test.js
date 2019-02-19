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

jest.mock('filestack-js', () => {
  const picker = jest.fn(({ onUploadDone }) => ({
    open: () => {
      mock_onUploadDone = onUploadDone;
    },
  }));

  return {
    mock_picker: picker,
    init: () => ({
      picker,
      session: {},
    }),
  };
});

const filestack = require('filestack-js');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('should call onChange when file is uploaded', () => {
  it('for single file input', async () => {
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

    const originalFile = new File([''], 'filename');

    await mock_onUploadDone({ filesUploaded: [{ handle: 'handle', filename: 'filename', originalFile }] });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toEqual({ fileId: 'handle', filename: 'filename', public: false });
    expect(onChange.mock.calls[0][1]).toEqual(originalFile);
  });

  it('for single file input with public modifier', async() => {
    const renderFileInputView = jest.fn(() => null);
    const onChange = jest.fn();

    renderer.create(
      <FileInput onChange={ onChange } public>
        { renderFileInputView }
      </FileInput>,
    );

    expect(renderFileInputView).toHaveBeenCalledTimes(1);

    await renderFileInputView.mock.calls[0][0].pick();

    expect(mock_client.query).toHaveBeenCalledTimes(1);
    expect(mock_client.query.mock.calls[0]).toMatchSnapshot();

    const originalFile = new File([''], 'filename');

    await mock_onUploadDone({ filesUploaded: [{ handle: 'handle', filename: 'filename', originalFile }] });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toEqual({ fileId: 'handle', filename: 'filename', public: true });
    expect(onChange.mock.calls[0][1]).toEqual(originalFile);
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

    const originalFile1 = new File([''], 'filename1');
    const originalFile2 = new File([''], 'filename2');
    const originalFile3 = new File([''], 'filename3');

    await mock_onUploadDone({
      filesUploaded: [
        { handle: 'handle1', filename: 'filename1', originalFile: originalFile1 },
        { handle: 'handle2', filename: 'filename2', originalFile: originalFile2 },
        { handle: 'handle3', filename: 'filename3', originalFile: originalFile3 },
      ],
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toEqual(
      [
        { fileId: 'handle1', filename: 'filename1', public: false },
        { fileId: 'handle2', filename: 'filename2', public: false },
        { fileId: 'handle3', filename: 'filename3', public: false },
      ],
    );
    expect(onChange.mock.calls[0][1]).toEqual(
      [
        originalFile1,
        originalFile2,
        originalFile3,
      ],
    );
  });

  it('for input with custom on upload handler', async() => {
    const renderFileInputView = jest.fn(() => null);
    const onChange = jest.fn();

    const onUploadDone = (value) => new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...value, id: 'id', downloadUrl: 'downloadUrl' });
      }, 50);
    });

    renderer.create(
      <FileInput onChange={ onChange } onUploadDone={ onUploadDone }>
        { renderFileInputView }
      </FileInput>,
    );

    expect(renderFileInputView).toHaveBeenCalledTimes(1);

    await renderFileInputView.mock.calls[0][0].pick();

    expect(mock_client.query).toHaveBeenCalledTimes(1);
    expect(mock_client.query.mock.calls[0]).toMatchSnapshot();

    await mock_onUploadDone({ filesUploaded: [{ handle: 'handle', filename: 'filename' }] });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toEqual({ fileId: 'handle', filename: 'filename', id: 'id', downloadUrl: 'downloadUrl', public: false });
  });
});

describe('FileInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows to pass custom options to pick method', async () => {
    const renderFileInputView = jest.fn(() => null);

    renderer.create(
      <FileInput>
        { renderFileInputView }
      </FileInput>,
    );

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

  it('doesn\'t allow to rewrite maxFiles and onUploadDone options', async () => {
    const renderFileInputView = jest.fn(() => null);

    renderer.create(
      <FileInput maxFiles={ 3 }>
        { renderFileInputView }
      </FileInput>,
    );

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

