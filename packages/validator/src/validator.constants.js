//@flow

export const FIELD_TYPE = {
  NUMBER: 'NUMBER',
  TEXT: 'TEXT',
  DATE: 'DATE',
  SWITCH: 'SWITCH',
  FILE: 'FILE',
  RELATION: 'RELATION',
};

export type FieldType = $Values<typeof FIELD_TYPE>;

export const FORMAT = {
  UNFORMATTED: 'UNFORMATTED',
  NAME: 'NAME',
  ADDRESS: 'ADDRESS',
  SSN: 'SSN',
  EIN: 'EIN',
  PHONE: 'PHONE',
  EMAIL: 'EMAIL',
  DATE: 'DATE',
  DATETIME: 'DATETIME',
};

export type Format = $Values<typeof FORMAT>;

export const FORMAT_PATTERN = {
  [FORMAT.UNFORMATTED]: /.*/,
  [FORMAT.NAME]: /.*/,
  [FORMAT.ADDRESS]: /.*/,
  [FORMAT.EMAIL]: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
  [FORMAT.PHONE]: /^(0|[1-9][0-9]{9})$/i,
  [FORMAT.SSN]: /^(?!666|000|9\d{2})\d{3}[- ]{0,1}(?!00)\d{2}[- ]{0,1}(?!0{4})\d{4}$/,
  [FORMAT.EIN]: /^\d{2}[- ]{0,1}\d{7}$/,
  [FORMAT.DATE]: /\d{4}-[01]\d-[0-3]\d/,
  [FORMAT.DATETIME]: /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/,
};

export const VALIDATION_ERROR = {
  IS_REQUIRED: (): string => 'Value is required',
  NOT_A_NUMBER: (): string => 'Value isn\'t a number',
  MAX_PRECISION: (maxPrecision: number): string => `Maximum allowed precision is ${maxPrecision}. It was exceeded.`,
  MIN_VALUE: (minValue: number): string => `Value is lower than minimum allowed value ${minValue}.`,
  MAX_VALUE: (maxValue: number): string => `Value is greater than maximum allowed value ${maxValue}.`,
  FORMAT: (format: Format): string => `Value doesn't match ${format} format.`,
  MAX_FIELD_SIZE: (maxFieldSize: number): string => `Maximum allowed field size is ${maxFieldSize}. It was exceeded.`,
  [FORMAT.UNFORMATTED]: (): string => '',
  [FORMAT.NAME]: (): string => '',
  [FORMAT.ADDRESS]: (): string => '',
  [FORMAT.EMAIL]: (): string => 'Invalid email.',
  [FORMAT.PHONE]: (): string => 'Invalid phone number.',
  [FORMAT.SSN]: (): string => 'Invalid Social Security Number.',
  [FORMAT.EIN]: (): string => 'Invalid Employer Identification Number.',
  [FORMAT.DATE]: (): string => 'Invalid date.',
  [FORMAT.DATETIME]: (): string => 'Invalid datetime.',
};

export type ValidationError = $Values<typeof VALIDATION_ERROR>;
