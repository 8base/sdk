import React from 'react';
import * as R from 'ramda';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Subtract } from 'utility-types';
import { TableSchema } from '@8base/utils';

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

type TableSchemaProviderProps =
  | {
      children: React.ReactNode;
      tablesList?: TableSchema[];
    }
  | {
      children: (props: any) => React.ReactNode;
      tablesList?: TableSchema[];
    };

/**
 * Provider for 8base table schemas
 * @property {Function} children Children of the provider. Could be either react node or function with loading state.
 */
class TableSchemaProvider extends React.Component<TableSchemaProviderProps> {
  public renderChildren = (args: { loading: boolean }) => {
    const { children } = this.props;

    if (typeof children === 'function') {
      return children(args);
    }

    return children;
  };

  public renderContent = ({ data, loading }: { data?: any; loading: boolean } = { loading: false }) => {
    const { children } = this.props;

    return (
      <TableSchemaContext.Provider
        value={{
          tablesList: R.pathOr([], ['tablesList', 'items'], data),
          loading,
        }}
      >
        {this.renderChildren({ loading })}
      </TableSchemaContext.Provider>
    );
  };

  public render() {
    const { children, tablesList, ...rest } = this.props;

    if (tablesList) {
      return (
        <TableSchemaContext.Provider value={{ tablesList, loading: false }}>
          {this.renderChildren({ loading: false })}
        </TableSchemaContext.Provider>
      );
    }

    return (
      <Query query={TABLES_SCHEMA_QUERY} {...rest}>
        {this.renderContent}
      </Query>
    );
  }
}

export { TableSchemaProvider };
