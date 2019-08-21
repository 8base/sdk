export const FIELD_TYPE: {
  DATE: 'DATE';
  FILE: 'FILE';
  ID: 'ID';
  JSON: 'JSON';
  MISSING_RELATION: 'MISSING_RELATION';
  NUMBER: 'NUMBER';
  ONE_WAY_RELATION: 'ONE_WAY_RELATION';
  RELATION: 'RELATION';
  SMART: 'SMART';
  SWITCH: 'SWITCH';
  TEXT: 'TEXT';
} = {
  DATE: 'DATE',
  FILE: 'FILE',
  ID: 'ID',
  JSON: 'JSON',
  MISSING_RELATION: 'MISSING_RELATION',
  NUMBER: 'NUMBER',
  ONE_WAY_RELATION: 'ONE_WAY_RELATION',
  RELATION: 'RELATION',
  SMART: 'SMART',
  SWITCH: 'SWITCH',
  TEXT: 'TEXT',
};

export const SWITCH_FORMATS: {
  ACTIVE_INACTIVE: 'ACTIVE_INACTIVE';
  CUSTOM: 'CUSTOM';
  HIGH_LOW: 'HIGH_LOW';
  ON_OFF: 'ON_OFF';
  TRUE_FALSE: 'TRUE_FALSE';
  YES_NO: 'YES_NO';
} = {
  ACTIVE_INACTIVE: 'ACTIVE_INACTIVE',
  CUSTOM: 'CUSTOM',
  HIGH_LOW: 'HIGH_LOW',
  ON_OFF: 'ON_OFF',
  TRUE_FALSE: 'TRUE_FALSE',
  YES_NO: 'YES_NO',
};

export const SWITCH_VALUES: {
  ACTIVE_INACTIVE: {
    false: 'Inactive';
    true: 'Active';
  };
  HIGH_LOW: {
    false: 'Low';
    true: 'High';
  };
  ON_OFF: {
    false: 'Off';
    true: 'On';
  };
  TRUE_FALSE: {
    false: 'False';
    true: 'True';
  };
  YES_NO: {
    false: 'No';
    true: 'Yes';
  };
} = {
  ACTIVE_INACTIVE: {
    false: 'Inactive',
    true: 'Active',
  },
  HIGH_LOW: {
    false: 'Low',
    true: 'High',
  },
  ON_OFF: {
    false: 'Off',
    true: 'On',
  },
  TRUE_FALSE: {
    false: 'False',
    true: 'True',
  },
  YES_NO: {
    false: 'No',
    true: 'Yes',
  },
};

export const TEXT_FORMATS: {
  EIN: 'EIN';
  EMAIL: 'EMAIL';
  NAME: 'NAME';
  PHONE: 'PHONE';
  SSN: 'SSN';
  UNFORMATTED: 'UNFORMATTED';
} = {
  EIN: 'EIN',
  EMAIL: 'EMAIL',
  NAME: 'NAME',
  PHONE: 'PHONE',
  SSN: 'SSN',
  UNFORMATTED: 'UNFORMATTED',
};

export const NUMBER_FORMATS: {
  CURRENCY: 'CURRENCY';
  FRACTION: 'FRACTION';
  NUMBER: 'NUMBER';
  PERCENTAGE: 'PERCENTAGE';
  SCIENTIFIC: 'SCIENTIFIC';
} = {
  CURRENCY: 'CURRENCY',
  FRACTION: 'FRACTION',
  NUMBER: 'NUMBER',
  PERCENTAGE: 'PERCENTAGE',
  SCIENTIFIC: 'SCIENTIFIC',
};

export const FILE_FORMATS: {
  FILE: 'FILE';
  IMAGE: 'IMAGE';
} = {
  FILE: 'FILE',
  IMAGE: 'IMAGE',
};

export const SMART_FORMATS: {
  ADDRESS: 'ADDRESS';
  PHONE: 'PHONE';
} = {
  ADDRESS: 'ADDRESS',
  PHONE: 'PHONE',
};

export const DATE_FORMATS: {
  DATE: 'DATE';
  DATETIME: 'DATETIME';
} = {
  DATE: 'DATE',
  DATETIME: 'DATETIME',
};

export const MUTATION_TYPE: {
  CREATE: 'CREATE';
  UPDATE: 'UPDATE';
} = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
};

export const SYSTEM_TABLES: {
  API_TOKENS: 'ApiTokens';
  ENVIRONMENT_VARIABLES: 'EnvironmentVariables';
  FILES: 'Files';
  INVITATIONS: 'Invitations';
  PERMISSIONS: 'Permissions';
  ROLES: 'Roles';
  SETTINGS: 'Settings';
  USERS: 'Users';
} = {
  API_TOKENS: 'ApiTokens',
  ENVIRONMENT_VARIABLES: 'EnvironmentVariables',
  FILES: 'Files',
  INVITATIONS: 'Invitations',
  PERMISSIONS: 'Permissions',
  ROLES: 'Roles',
  SETTINGS: 'Settings',
  USERS: 'Users',
};

export const MUTATION_FILE_FIELDS = ['fileId', 'public', 'filename', 'meta', 'mods'];

export const APP_STATUS: {
  ACTIVE: 'ACTIVE';
  INACTIVE: 'INACTIVE';
} = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

export const APP_TYPES = {
  SALESFORCE: 'salesforce',
};

export const FIELD_KINDS = {
  USER: 'USER',
  SYSTEM: 'SYSTEM',
  EXTERNAL: 'EXTERNAL',
};
