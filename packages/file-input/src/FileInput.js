// @flow
import React from 'react';
import { withApollo } from 'react-apollo';
import * as filestack from 'filestack-js';
import gql from 'graphql-tag';

type FileInputValue = { fileId: string, filename: string };

type FileInputProps = {
  client: Object,
  onChange: (value: FileInputValue | FileInputValue[]) => void,
  children: ({ pick: () => Promise<void>, value: ?FileInputValue | FileInputValue[], error: ?Object }) => React$Node,
  value?: FileInputValue | FileInputValue[],
  maxFiles?: number,
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

  onUploadDone = ({ filesUploaded }) => {
    let value = filesUploaded.map(({ handle, filename }) => ({
      fileId: handle,
      filename,
    }));

    const { maxFiles } = this.props;

    if (maxFiles === 1) {
      value = value[0];
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
