export const USER_REFRESH_TOKEN_QUERY = `
  mutation UserRefreshToken($refreshToken: String!, $email: String!) {
    userRefreshToken(data: {
      refreshToken: $refreshToken,
      email: $email,
    }) {
      refreshToken
      idToken
    }
  }
`;

export const TABLES_LIST_QUERY = `
  query TableList($filter: TableListFilter) {
    tablesList(filter: $filter) {
      items {
        ...TableFragment
      }
    }
  }

  fragment TableFragment on Table {
    id
    name
    displayName
    isSystem
    fields {
      ...TableFieldFragment
    }
  }

  fragment TableFieldFragment on TableField {
    ...CommonTableFieldFragment
    fieldTypeAttributes {
      ...TextFieldTypeAttributes
      ...NumberFieldTypeAttributes
      ...FileFieldTypeAttributes
      ...DateFieldTypeAttributes
      ...SwitchFieldTypeAttributes
      ...SmartFieldTypesAttributes
    }
  }

  fragment CommonTableFieldFragment on TableField {
    id
    name
    displayName
    description
    fieldType
    fieldTypeAttributes {
      ...TextFieldTypeAttributes
      ...NumberFieldTypeAttributes
      ...FileFieldTypeAttributes
      ...DateFieldTypeAttributes
      ...SwitchFieldTypeAttributes
    }
    isList
    isRequired
    isUnique
    defaultValue
    isSystem
    isMeta
    relation {
      refFieldName
      refFieldDisplayName
      relationTableName
      relationFieldName
      refTable {
        id
        name
      }
      refFieldIsList
      refFieldIsRequired
    }
  }

  fragment DateFieldTypeAttributes on DateFieldTypeAttributes {
    format
  }

  fragment TextFieldTypeAttributes on TextFieldTypeAttributes {
    format
    fieldSize
  }

  fragment NumberFieldTypeAttributes on NumberFieldTypeAttributes {
    format
    precision
    currency
    minValue
    maxValue
    isBigInt
  }

  fragment FileFieldTypeAttributes on FileFieldTypeAttributes {
    format
    maxSize
    typeRestrictions
  }

  fragment SmartFieldTypesAttributes on SmartFieldTypeAttributes {
    format
    innerFields {
      name
      displayName
      description
      fieldType
      isList
      isRequired
      isUnique
      fieldTypeAttributes {
        ...TextFieldTypeAttributes
        ...NumberFieldTypeAttributes
        ...FileFieldTypeAttributes
        ...DateFieldTypeAttributes
        ...SwitchFieldTypeAttributes
      }
    }
  }

  fragment SwitchFieldTypeAttributes on SwitchFieldTypeAttributes {
    format
    listOptions
  }
`;

export const TABLE_CREATE_MUTATION = `
  mutation TableCreate($data: TableCreateInput!) {
    tableCreate(data: $data) {
      id
    }
  }
`;

export const FIELD_CREATE_MUTATION = `
  mutation FieldCreate($data: TableFieldCreateInput!) {
    fieldCreate(data: $data) {
      id
    }
  }
`;

export const USER_QUERY = `
  query User {
    user {
      id
    }
  }
`;

export const FILE_UPLOAD_INFO_QUERY = `
  query FileUploadInfo {
    fileUploadInfo {
      apiKey
      policy
      signature
      path
    }
  }
`;
