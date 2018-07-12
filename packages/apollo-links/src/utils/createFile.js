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
  }
`;

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

type EventListener = (Event) => any;

type XHREventListeners = {
  onProgress?: EventListener,
  onError?: EventListener,
  onLoad?: EventListener,
  onAbort?: EventListener,
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

const addEventListeners = (request: XMLHttpRequest, eventListeners: XHREventListeners) => {
  if (eventListeners.onProgress) {
    request.addEventListener('progress', eventListeners.onProgress);
  }

  if (eventListeners.onLoad) {
    request.addEventListener('progress', eventListeners.onLoad);
  }

  if (eventListeners.onError) {
    request.addEventListener('progress', eventListeners.onError);
  }

  if (eventListeners.onAbort) {
    request.addEventListener('progress', eventListeners.onAbort);
  }
};

const uploadFile = (
  { file, createdFile }: UploadFileOptions,
  eventListeners: XHREventListeners,
  requestCallback?: (XMLHttpRequest) => any,
): Promise<*> => new Promise((resolve, reject) => {
  const fields = createdFile.fields || {};
  const form: FormData = new FormData();
  const request = new XMLHttpRequest();

  if (requestCallback) {
    requestCallback(request);
  }

  addEventListeners(request, eventListeners);

  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      if (request.status === 200) {
        resolve(request.response);
      } else {
        reject(request.status);
      }
    }
  };

  Object
    .entries(fields)
    .forEach(([key, value]) => {
      if (typeof value === 'string') {
        form.append(key, value);
      }
    });

  form.append('file', file);

  request.open('POST', createdFile.uploadUrl, true);
  request.send(form);
});

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
  eventListeners?: XHREventListeners = {},
  requestCallback?: (XMLHttpRequest) => any,
): Promise<CreatedFile> => new Promise((resolve, reject) => {
  const filename = getFileNameToUpload(file, fileMeta);

  // Don't delete query or mutation fields.
  // They are both required for consistent work.
  mutate({
    query: FILE_CREATE_MUTATION,
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

      uploadFile({ file, createdFile }, eventListeners, requestCallback)
        .then(() => resolve(createdFile))
        .catch((error: ?mixed) => reject(error));
    },
  });
});
