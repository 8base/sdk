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
    pick: (options: {}) => Promise<void>;
    value: FileInputValue | null;
    originalFile: OriginalFileInputValue | null;
    error: object | null;
  }) => React.ReactNode;
  public?: boolean;
  maxFiles?: number;
  sessionCache?: boolean;
  onUploadDone?: (value: FileInputValue, originalFile?: OriginalFileInputValue) => Promise<FileInputValue>;
  value?: FileInputValue | null;
};

export type FileInputState = {
  path: string | null;
  error: object | null;
  value: FileInputValue | null;
  originalFile: OriginalFileInputValue | null;
};
