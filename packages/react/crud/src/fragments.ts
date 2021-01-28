import { gql } from '@apollo/client';

export const NumberFieldTypeAttributes = gql`
  fragment NumberFieldTypeAttributes on NumberFieldTypeAttributes {
    format
    precision
    currency
    minValue
    maxValue
  }
`;

export const TextFieldTypeAttributes = gql`
  fragment TextFieldTypeAttributes on TextFieldTypeAttributes {
    format
    fieldSize
  }
`;

export const FileFieldTypeAttributes = gql`
  fragment FileFieldTypeAttributes on FileFieldTypeAttributes {
    format
    maxSize
    typeRestrictions
  }
`;

export const DateFieldTypeAttributes = gql`
  fragment DateFieldTypeAttributes on DateFieldTypeAttributes {
    format
  }
`;

export const SwitchFieldTypeAttributes = gql`
  fragment SwitchFieldTypeAttributes on SwitchFieldTypeAttributes {
    format
    listOptions
  }
`;

export const TableFieldFragment = gql`
  fragment TableFieldFragment on TableField {
    id
    name
    displayName
    description
    fieldType
    fieldTypeAttributes {
      id
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
      id
      refFieldName
      refFieldDisplayName
      relationTableName
      relationFieldName
      refTable {
        id
        name
        displayName
      }
      refFieldIsList
      refFieldIsRequired
    }
  }

  ${DateFieldTypeAttributes}
  ${TextFieldTypeAttributes}
  ${NumberFieldTypeAttributes}
  ${FileFieldTypeAttributes}
  ${SwitchFieldTypeAttributes}
`;

export const TableFragment = gql`
  fragment TableFragment on Table {
    id
    name
    displayName
    isSystem
    fields {
      ...TableFieldFragment
    }
  }

  ${TableFieldFragment}
`;
