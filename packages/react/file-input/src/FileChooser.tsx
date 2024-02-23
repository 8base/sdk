import React, { useState, useEffect, useMemo } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
// import { withApollo, WithApolloClient } from 'react-apollo';
import { useApolloClient } from '@apollo/client';

import gql from 'graphql-tag';
import { FileInputValue, OriginalFileInputValue } from './types';

interface IFileChooserProps {
  maxFiles?: number;
  onUploadDone?: (value: FileInputValue, originalFile: OriginalFileInputValue) => Promise<FileInputValue>;
  onChange: (value: any, originalFile: File[]) => void;
  // client: WithApolloClient<any>;
  value: any;
  workspace?: string;
  apiKey?: string;
  uploadHost?: string | 'http://localhost:3007';
}

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

const FileChooser: React.FC<IFileChooserProps> = ({
  maxFiles,
  onUploadDone,
  onChange,
  // client,
  value,
  workspace,
  apiKey,
  uploadHost,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [path, setPath] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const client = useApolloClient();
  const cardsContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
  };

  const cardStyle: React.CSSProperties = {
    width: '120px',
    height: '150px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    margin: '10px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  };

  const cardBodyStyle: React.CSSProperties = {
    padding: '8px',
    flex: 1,
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const imageStyle: React.CSSProperties = {
    objectFit: 'cover',
    height: 'auto',
    marginBottom: '8px',
    borderRadius: '4px',
  };

  const fileNameStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 'bold',
    textAlign: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const dropzoneStyle: React.CSSProperties = {
    border: '2px dashed #cccccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
  };

  const [error, setError] = useState<Error | null>(null);

  /* const { loading, error: queryError } = client.query({
    query: FILE_UPLOAD_INFO_QUERY,
  }); */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await client.query({
          query: FILE_UPLOAD_INFO_QUERY,
        });
        if (result.data) {
          const { path } = result.data.fileUploadInfo;
          setPath(path);
        }
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onDrop = (acceptedFiles: File[]) => {
    if (maxFiles && maxFiles > 1) {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    } else {
      setFiles([acceptedFiles[0]]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  const uploadToS3 = async (files: File[]) => {
    const myHeaders = new Headers();
    setUploading(true);
    myHeaders.append('storage-provider', 'S3');
    if (apiKey) {
      myHeaders.append('authorization', apiKey);
    }
    if (workspace) {
      myHeaders.append('workspace', workspace);
    }

    const formdata = new FormData();

    files.forEach((file) => {
      formdata.append('files', file, file.name);
    });

    formdata.append('bucketName', 'test-dyron');

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow' as RequestRedirect,
    };

    try {
      const response = await fetch(uploadHost + '/upload', requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      setUploadProgress(100);

      return result.data;
    } catch (error) {
      throw error;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleUpload = async () => {
    setUploadProgress(1);
    let value = await uploadToS3(files);
    const originalFile = files.map((item) => item);
    if (maxFiles === 1) {
      value = value[0];
    }
    if (typeof onChange === 'function') {
      onChange(value, originalFile);
    }

    if (maxFiles === 1) {
      // setFiles([value[0]]);
    }

    if (typeof onUploadDone === 'function') {
      onUploadDone(value, originalFile);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ('image/*' as unknown) as Accept,
  });

  const renderTableFields = () => {
    return (
      <div style={cardsContainerStyle}>
        {files.length > 0 &&
          files.map((file, index) => (
            <div key={index} style={cardStyle}>
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <button
                  onClick={() => removeFile(index)}
                  style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    padding: '4px',
                    cursor: 'pointer',
                    zIndex: 1,
                    background: 'transparent',
                    border: 'none',
                    transition: 'color 0.3s ease',
                  }}
                  onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.color = 'blue')}
                  onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.color = 'gray')}
                >
                  X
                </button>
                <div style={cardBodyStyle}>
                  <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} style={imageStyle} />
                  <p style={fileNameStyle}>{file.name}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  };

  const memoizedRenderTableFields = useMemo(() => renderTableFields(), [files]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <div {...getRootProps()} style={dropzoneStyle}>
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the files here...</p> : <p>Drag and drop some files here, or click to select files</p>}
      </div>

      {files.length > 0 && memoizedRenderTableFields}

      {uploadProgress > 0 && <p>Uploading... {uploadProgress}%</p>}

      <button
        type="button"
        onClick={handleUpload}
        disabled={uploading || files.length === 0}
        style={{
          marginTop: '10px',
          padding: '8px',
          background: uploading || files.length === 0 ? '#dcdcdc' : '#0874F9',
          color: uploading || files.length === 0 ? '#808080' : '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Upload
      </button>
    </div>
  );
};

// const FileChooserWithApollo = withApollo<IFileChooserProps>(FileChooser);

export default FileChooser;
