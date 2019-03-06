//@flow

export const FIELD_TYPE = {
  DATE: 'DATE',
  FILE: 'FILE',
  ID: 'ID',
  NUMBER: 'NUMBER',
  RELATION: 'RELATION',
  SWITCH: 'SWITCH',
  TEXT: 'TEXT',
  SMART: 'SMART',
};

export const SWITCH_FORMATS = {
  ON_OFF: 'ON_OFF',
  YES_NO: 'YES_NO',
  TRUE_FALSE: 'TRUE_FALSE',
  ACTIVE_INACTIVE: 'ACTIVE_INACTIVE',
  HIGH_LOW: 'HIGH_LOW',
  CUSTOM: 'CUSTOM',
};


export const SWITCH_VALUES = {
  ON_OFF: {
    true: 'On',
    false: 'Off',
  },
  YES_NO: {
    true: 'Yes',
    false: 'No',
  },
  TRUE_FALSE: {
    true: 'True',
    false: 'False',
  },
  ACTIVE_INACTIVE: {
    true: 'Active',
    false: 'Inactive',
  },
  HIGH_LOW: {
    true: 'High',
    false: 'Low',
  },
};

export const TEXT_FORMATS = {
  UNFORMATTED: 'UNFORMATTED',
  NAME: 'NAME',
  SSN: 'SSN',
  EIN: 'EIN',
  PHONE: 'PHONE',
  EMAIL: 'EMAIL',
};

export const NUMBER_FORMATS = {
  NUMBER: 'NUMBER',
  CURRENCY: 'CURRENCY',
  PERCENTAGE: 'PERCENTAGE',
  FRACTION: 'FRACTION',
  SCIENTIFIC: 'SCIENTIFIC',
};

export const FILE_FORMATS = {
  FILE: 'FILE',
  IMAGE: 'IMAGE',
};

export const SMART_FORMATS = {
  ADDRESS: 'ADDRESS',
  PHONE: 'PHONE',
};

export const DATE_FORMATS = {
  DATE: 'DATE',
  DATETIME: 'DATETIME',
};

export const MUTATION_TYPE = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
};

export const SYSTEM_TABLES = {
  USERS: 'Users',
  FILES: 'Files',
  SETTINGS: 'Settings',
  ROLES: 'Roles',
  INVITATIONS: 'Invitations',
  PERMISSIONS: 'Permissions',
  API_TOKENS: 'ApiTokens',
  ENVIRONMENT_VARIABLES: 'EnvironmentVariables',
};
