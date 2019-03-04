// @flow
import React from 'react';
import * as R from 'ramda';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import { TableSchemaContext } from './TableSchemaContext';

export const TABLE_FIELD_FRAGMENT = gql`
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
      refField {
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

export const TABLE_FRAGMENT = gql`
  fragment TableFragment on Table {
    id
    name
    displayName
    isSystem
    fields {
      ...TableFieldFragment
    }
  }

  ${TABLE_FIELD_FRAGMENT}
`;

export const TABLES_SCHEMA_QUERY = gql`
  query TablesSchema {
    tablesList {
      items {
        ...TableFragment
      }
      count
    }
  }

  ${TABLE_FRAGMENT}
`;

type TableSchemaProviderProps = {
  children: ({ loading?: boolean }) => React$Node,
};

/**
 * Provider for 8base table schemas
 * @property {Function} children Children of the provider. Could be either react node or function with loading state.
 */
class TableSchemaProvider extends React.Component<TableSchemaProviderProps> {
  renderContent = ({ data, loading }: * = {}) => {
    const { children } = this.props;

    return (
      <TableSchemaContext.Provider value={ R.pathOr([], ['tablesList', 'items'], data) }>
        { children({ loading }) }
      </TableSchemaContext.Provider>
    );
  };

  render() {
    const {
      children,
      ...rest
    } = this.props;

    return (
      <Query query={ TABLES_SCHEMA_QUERY } { ...rest } >
        { this.renderContent }
      </Query>
    );
  }
}

export { TableSchemaProvider };

