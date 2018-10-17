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

it('should call onChange when file is uploaded', async () => {
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

  mock_onUploadDone({ filesUploaded: [{ handle: 'handle', filename: 'filename' }] });

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange.mock.calls[0][0]).toEqual({ fileId: 'handle', filename: 'filename' });
});
