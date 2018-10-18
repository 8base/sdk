// @flow
import React from 'react';
import { withApollo } from 'react-apollo';
import * as filestack from 'filestack-js';
import gql from 'graphql-tag';

type FileValue = {
  fileId: string,
  filename: string,
  id?: string,
  downloadUrl?: string,
};

type FileInputValue = FileValue | FileValue[];

type FileInputProps = {
  client: Object,
  onChange: (value: FileInputValue) => void,
  children: ({ pick: () => Promise<void>, value: ?FileInputValue, error: ?Object }) => React$Node,
  value?: FileInputValue,
  maxFiles?: number,
  onUploadFinish?: (value: FileInputValue) => Promise<FileInputValue>,
};

type FileInputState = {
  path: ?string,
  error: ?Object,
};

const FILE_UPLOAD_INFO_QUERY = gql`
  query FileUploadInfo {
    fileUploadInfo {
      policy
      signature
      apiKey
      path
    }
  }
`;

class FileInput extends React.Component<FileInputProps, FileInputState> {
  filestack: Object;
  filestackPromise: Promise<void>;

  static defaultProps = {
    maxFiles: 1,
  };

  constructor(props) {
    super(props);

    this.state = {
      path: null,
      error: null,
    };
  }

  componentDidMount() {
    this.filestackPromise = this.initFilestack();
  }

  async initFilestack() {
    const { client } = this.props;

    let response = null;

    try {
      response = await client.query({ query: FILE_UPLOAD_INFO_QUERY });
    } catch (e) {
      this.setState({ error: e });

      return;
    }

    const { apiKey, policy, signature, path } = response.data.fileUploadInfo;

    this.setState({ path });

    this.filestack = filestack.init(apiKey, {
      security: {
        policy,
        signature,
      },
    });
  }

  onUploadDone = async ({ filesUploaded }) => {
    let value = filesUploaded.map(({ handle, filename }) => ({
      fileId: handle,
      filename,
    }));

    const { maxFiles, onUploadFinish } = this.props;

    if (maxFiles === 1) {
      value = value[0];
    }

    if (typeof onUploadFinish === 'function') {
      value = await onUploadFinish(value);
    }

    this.props.onChange(value);
  };

  collectPickerOptions = () => {
    const { maxFiles } = this.props;
    const { path } = this.state;

    return {
      onUploadDone: this.onUploadDone,
      storeTo: {
        path,
      },
      maxFiles,
    };
  };

  pick = async () => {
    await this.filestackPromise;

    const pickerOptions = this.collectPickerOptions();

    this.filestack.picker(pickerOptions).open();
  };

  render() {
    const { children, value } = this.props;

    const { error } = this.state;

    return children({ pick: this.pick, value, error });
  }
}

FileInput = withApollo(FileInput);

export { FileInput };
