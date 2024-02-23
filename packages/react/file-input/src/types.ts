import { FetchPolicy } from '@apollo/client';

export type FileValue = {
  fileId: string;
  filename: string;
  id?: string;
  downloadUrl?: string;
  mimetype?: string;
};

export type FileInputValue = FileValue | FileValue[];

export type OriginalFileInputValue = File | File[];

export type FileInputProps = {
  onChange?: (value: FileInputValue, originalFile: OriginalFileInputValue) => void;
  children: (args: {
    pick?: (options: {}) => Promise<void>;
    openModal?: () => void;
    value: FileInputValue | null;
    originalFile: OriginalFileInputValue | null;
    error: object | null;
  }) => React.ReactNode;
  public?: boolean;
  fetchPolicy?: FetchPolicy;
  maxFiles?: number;
  sessionCache?: boolean;
  useFilestack?: boolean;
  workspace?: string;
  apiKey?: string;
  uploadHost?: string;
  onUploadDone?: (value: FileInputValue, originalFile?: OriginalFileInputValue) => Promise<FileInputValue>;
  value?: FileInputValue | null;
};

export type FileInputState = {
  path: string | null;
  error: object | null;
  value: FileInputValue | null;
  originalFile: OriginalFileInputValue | null;
  isModalOpen: boolean | false;
};
