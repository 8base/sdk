//@flow

import gql from 'graphql-tag';
import * as R from 'ramda';

const FILE_CREATE_MUTATION = gql`
  mutation FileCreateMutation ($data: FileCreateInput) {
    fileCreate(data: $data) {
      id
      fileId
      filename
      uploadUrl
      fields
    }
  }`;

export type CreatedFile = {
  id: string,
  fileId: string,
  filename: string,
  uploadUrl: string,
  fields: {},
};

type FileCreateMutationResponse = {
  data: {
    fileCreate: CreatedFile,
  },
  errors: {},
};

type FileMeta = {
  public?: boolean,
  filename?: string,
  meta?: JSON,
  mods?: JSON,
};

type UploadFileLinkOptions = {
  file: File,
  fileMeta?: FileMeta,
};

type UploadFileOptions = {
  file: File,
  createdFile: CreatedFile,
};

const getFileNameToUpload = (file?: File, metaData?: FileMeta): string => {
  if (metaData && metaData.filename) {
    return metaData.filename;
  }

  if (file && file.name) {
    return file.name;
  }

  return 'file';
};

const checkHasErrors: (response: FileCreateMutationResponse) => boolean = R.both(
  R.has('errors'),
  R.pipe(
    R.prop('errors'),
    R.complement(R.isEmpty),
  ),
);

const uploadFile = ({ file, createdFile }: UploadFileOptions): Promise<*> => {
  const fields = createdFile.fields || {};
  const form: FormData = new FormData();

  Object
    .entries(fields)
    .forEach(([key, value]) => {
      if (typeof value === 'string') {
        form.append(key, value);
      }
    });

  form.append('file', file);

  return fetch(createdFile.uploadUrl, {
    method: 'POST',
    body: form,
  });
};

/**
 * Function creates file relation in database
 * and uploads its content to uploadUrl @see {CreatedFile}
 * @param {UploadFileLinkOptions} uploadFileLinkOptions - file info.
 * @param {Function} mutate - apollo client's mutate function.
 * @returns {Promise<CreatedFile>} promise that resolves file link.
 */
export const createFile = (
  { file, fileMeta }: UploadFileLinkOptions,
  mutate: (any) => any,
): Promise<CreatedFile> => new Promise((resolve, reject) => {
  const filename = getFileNameToUpload(file, fileMeta);

  mutate({
    mutation: FILE_CREATE_MUTATION,
    variables: {
      data: { ...fileMeta, filename },
    },
  }).subscribe({
    error: (error: any) => reject(error),
    next: (response: FileCreateMutationResponse) => {
      const createdFile: ?CreatedFile = R.path(['data', 'fileCreate'], response);

      if (!createdFile || checkHasErrors(response)) {
        return reject(response);
      }

      uploadFile({ file, createdFile })
        .then(() => resolve(createdFile))
        .catch((error: ?mixed) => reject(error));
    },
  });
});
