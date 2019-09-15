import React from 'react';
import { withApollo, WithApolloClient } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import * as filestack from 'filestack-js';
import gql from 'graphql-tag';

type FileValue = {
  fileId: string;
  filename: string;
  id?: string;
  downloadUrl?: string;
};

type FileInputValue = FileValue | FileValue[];
type OriginalFileInputValue = File | File[];

type FileInputProps = {
  onChange?: (value: FileInputValue, originalFile: OriginalFileInputValue) => void;
  children: (args: {
    pick: (options: {}) => Promise<void>;
    value: FileInputValue | null;
    originalFile: OriginalFileInputValue | null;
    error: object | null;
  }) => React.ReactNode;
  public?: boolean;
  maxFiles?: number;
  onUploadDone?: (value: FileInputValue, originalFile?: OriginalFileInputValue) => Promise<FileInputValue>;
  value?: FileInputValue | null;
};

type FileInputState = {
  path: string | null;
  error: object | null;
  value: FileInputValue | null;
  originalFile: OriginalFileInputValue | null;
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

const FileInput: React.ComponentType<FileInputProps> = withApollo(
  // @ts-ignore
  class FileInput extends React.Component<WithApolloClient<FileInputProps>, FileInputState> {
    public static defaultProps = {
      maxFiles: 1,
      value: null,
    };

    public static getDerivedStateFromProps(props: FileInputProps, state: FileInputState) {
      let nextState = null;

      if (props.value !== state.value) {
        nextState = { value: props.value };
      }

      return nextState;
    }

    public filestack?: { [key: string]: any };
    public filestackPromise?: Promise<void>;

    constructor(props: FileInputProps & { client: ApolloClient<any> }) {
      super(props);

      this.state = {
        error: null,
        originalFile: null,
        path: null,
        value: props.value || null,
      };
    }

    public componentDidMount() {
      this.filestackPromise = this.initFilestack();
    }

    public async initFilestack() {
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

    public onUploadDone = async ({ filesUploaded }: any) => {
      if (!this.filestack) {
        return;
      }

      const { policy = '""', signature = '""' } = this.filestack.session;

      let value = filesUploaded.map(({ handle, filename, url }: any) => {
        const urlOrigin = url ? new URL(url).origin : '';

        return {
          downloadUrl: `${urlOrigin}/security=p:${policy},s:${signature}/${handle}`,
          fileId: handle,
          filename,
          public: !!this.props.public,
        };
      });

      let originalFile = filesUploaded.map((item: any) => item.originalFile);

      const { maxFiles, onUploadDone, onChange } = this.props;

      if (maxFiles === 1) {
        value = value[0];
        originalFile = originalFile[0];
      }

      if (typeof onUploadDone === 'function') {
        value = await onUploadDone(value, originalFile);
      }

      this.setState({ value, originalFile });

      if (typeof onChange === 'function') {
        onChange(value, originalFile);
      }
    };

    public collectPickerOptions = () => {
      const { maxFiles } = this.props;
      const { path } = this.state;

      return {
        exposeOriginalFile: true,
        maxFiles,
        onUploadDone: this.onUploadDone,
        storeTo: {
          path,
        },
      };
    };

    public pick = async (options = {}) => {
      await this.filestackPromise;

      if (!this.filestack) {
        return;
      }

      if ('maxFiles' in options) {
        console.warn('Specify "maxFiles" as a prop for FileInput component'); // tslint:disable-line
      }

      if ('onUploadDone' in options) {
        console.warn('Specify "onUploadDone" as a prop for FileInput component'); // tslint:disable-line
      }

      const pickerOptions = this.collectPickerOptions();

      const picker = this.filestack.picker({
        ...options,
        ...pickerOptions,
      });

      await picker.open();

      return picker;
    };

    public render() {
      const { children } = this.props;

      const { error, value, originalFile } = this.state;

      return children({ pick: this.pick, value, originalFile, error });
    }
  },
);

export { FileInput };
