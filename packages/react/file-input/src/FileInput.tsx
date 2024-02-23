import React from 'react';
// TODO: apollo HOC is deprecated
import { withApollo, WithApolloClient } from '@apollo/client/react/hoc';
import { ApolloClient, gql } from '@apollo/client';
import * as filestack from 'filestack-js';
import { FileInputProps, FileInputState, FileInputValue } from './types';
import FileChooser from './FileChooser';

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

const FileInput: React.ComponentType<FileInputProps> = withApollo<FileInputProps>(
  // @ts-ignore-next-line
  class FileInput extends React.Component<WithApolloClient<FileInputProps>, FileInputState> {
    public static defaultProps = {
      maxFiles: 1,
      value: null,
      sessionCache: false,
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
        isModalOpen: false,
      };
    }

    public componentDidMount() {
      this.filestackPromise = this.initFilestack();
    }

    public async initFilestack() {
      const { client, sessionCache } = this.props;

      if (!client) {
        return;
      }

      let response = null;

      try {
        response = await client.query({ query: FILE_UPLOAD_INFO_QUERY, fetchPolicy: this.props.fetchPolicy });
      } catch (e) {
        this.setState({ error: e as Error });

        return;
      }

      const { apiKey, policy, signature, path } = response.data.fileUploadInfo;

      this.setState({ path });

      this.filestack = filestack.init(apiKey, {
        security: {
          policy,
          signature,
        },
        sessionCache,
      });
    }

    public openModal = () => {
      this.setState({ isModalOpen: true });
    };

    public closeModal = () => {
      this.setState({ isModalOpen: false });
    };

    public onUploadDone = async ({ filesUploaded }: any) => {
      if (!this.filestack) {
        return;
      }

      const { policy = '""', signature = '""' } = this.filestack.session;

      let value = filesUploaded.map(({ handle, filename, url, mimetype }: any) => {
        const urlOrigin = url ? new URL(url).origin : '';

        return {
          downloadUrl: `${urlOrigin}/security=p:${policy},s:${signature}/${handle}`,
          fileId: handle,
          filename,
          mimetype,
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
      // const { children } = this.props;
      const { children, useFilestack, onUploadDone, onChange, maxFiles, apiKey, workspace, uploadHost } = this.props;

      const { error, value, originalFile, isModalOpen } = this.state;

      if (useFilestack) {
        return children({ pick: this.pick, value, originalFile, error });
      } else {
        return (
          <>
            {children({ openModal: this.openModal, value, originalFile, error })}

            {isModalOpen && (
              <div
                style={{
                  position: 'fixed',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                  background: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 11999,
                }}
              >
                <div
                  style={{
                    background: '#fff',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <FileChooser
                    apiKey={apiKey}
                    workspace={workspace}
                    uploadHost={uploadHost}
                    onUploadDone={async (item, originalFile) => {
                      let result: FileInputValue = item;
                      if (typeof onUploadDone === 'function') {
                        result = await onUploadDone(item, originalFile);
                      }
                      this.setState({ value: item, originalFile });
                      this.closeModal();
                      return result;
                    }}
                    onChange={(value, originalFile) => {
                      if (typeof onChange === 'function') {
                        onChange(value, originalFile);
                      }
                    }}
                    maxFiles={maxFiles}
                    value={value}
                  />
                  <button
                    type="button"
                    onClick={this.closeModal}
                    style={{
                      float: 'right',
                      bottom: '10px',
                      right: '10px',
                      padding: '8px',
                      background: '#0874F9',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </>
        );
      }
    }
  },
);

export { FileInput };
