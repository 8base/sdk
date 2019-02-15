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
type OriginalFileInputValue = File | File[];

type FileInputProps = {
  client: Object,
  onChange: (value: FileInputValue, originalFile: OriginalFileInputValue) => void,
  children: ({ pick: () => Promise<void>, value: ?FileInputValue, originalFile: ?OriginalFileInputValue, error: ?Object }) => React$Node,
  maxFiles?: number,
  accept?: string | string[],
  public?: boolean,
  onUploadFinish?: (value: FileInputValue, originalFile: OriginalFileInputValue) => Promise<FileInputValue>,
};

type FileInputState = {
  path: ?string,
  error: ?Object,
  value: ?FileInputValue,
  originalFile: ?OriginalFileInputValue,
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
    value: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      path: null,
      error: null,
      originalFile: null,
      value: props.value,
    };
  }

  componentDidMount() {
    this.filestackPromise = this.initFilestack();
  }

  static getDerivedStateFromProps(props, state) {
    let nextState = null;

    if (props.value !== state.value) {
      nextState = { value: props.value };
    }

    return nextState;
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
      public: !!this.props.public,
    }));

    let originalFile = filesUploaded.map((item) => item.originalFile);

    const { maxFiles, onUploadFinish } = this.props;

    if (maxFiles === 1) {
      value = value[0];
      originalFile = originalFile[0];
    }

    if (typeof onUploadFinish === 'function') {
      value = await onUploadFinish(value, originalFile);
    }

    this.setState({ value, originalFile });

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(value, originalFile);
    }
  };

  collectPickerOptions = () => {
    const { maxFiles, accept } = this.props;
    const { path } = this.state;

    return {
      exposeOriginalFile: true,
      onUploadDone: this.onUploadDone,
      storeTo: {
        path,
      },
      maxFiles,
      ...(accept ? { accept } : {}),
    };
  };

  pick = async () => {
    await this.filestackPromise;

    const pickerOptions = this.collectPickerOptions();

    this.filestack.picker(pickerOptions).open();
  };

  render() {
    const { children } = this.props;

    const { error, value, originalFile } = this.state;

    return children({ pick: this.pick, value, originalFile, error });
  }
}

FileInput = withApollo(FileInput);

export { FileInput };
