import React from 'react';
import * as R from 'ramda';
import gql from 'graphql-tag';
import { Query, QueryProps } from 'react-apollo';
import { Subtract } from 'utility-types';

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
      ...MissingRelationFieldTypeAttributes
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
      ...MissingRelationFieldTypeAttributes
    }
    isList
    isRequired
    isUnique
    defaultValue
    isSystem
    isMeta
    isExternal
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
        ...MissingRelationFieldTypeAttributes
      }
    }
  }

  fragment SwitchFieldTypeAttributes on SwitchFieldTypeAttributes {
    format
    listOptions
  }

  fragment MissingRelationFieldTypeAttributes on MissingRelationFieldTypeAttributes {
    missingTable
  }
`;

export const TABLE_FRAGMENT = gql`
  fragment TableFragment on Table {
    id
    name
    displayName
    application {
      id
      name
      displayName
      description
      status
      appType
    }
    isSystem
    fields {
      ...TableFieldFragment
    }
  }

  ${TABLE_FIELD_FRAGMENT}
`;

export const APPLICATIONS_FRAGMENT = gql`
  fragment ApplicationFragment on Application {
    id
    name
    displayName
    description
    createdAt
    appType
    status
  }
`;

export const TABLES_SCHEMA_QUERY = gql`
  query TablesSchema {
    tablesList {
      items {
        ...TableFragment
      }
      count
    }

    applicationsList {
      items {
        ...ApplicationFragment
      }
      count
    }
  }

  ${TABLE_FRAGMENT}
  ${APPLICATIONS_FRAGMENT}
`;

type TableSchemaProviderProps = Subtract<QueryProps, { query: any }> & {
  children: (props: { loading?: boolean }) => React.ReactNode;
};

/**
 * Provider for 8base table schemas
 * @property {Function} children Children of the provider. Could be either react node or function with loading state.
 */
class TableSchemaProvider extends React.Component<TableSchemaProviderProps> {
  public renderContent = ({ data, loading }: { data?: any; loading?: boolean } = {}) => {
    const { children } = this.props;

    return (
      <TableSchemaContext.Provider
        value={{
          tablesList: R.pathOr([], ['tablesList', 'items'], data),
          applicationsList: R.pathOr([], ['applicationsList', 'items'], data),
        }}
      >
        {children({ loading })}
      </TableSchemaContext.Provider>
    );
  };

  public render() {
    const { children, ...rest } = this.props;

    return (
      <Query query={TABLES_SCHEMA_QUERY} {...rest}>
        {this.renderContent}
      </Query>
    );
  }
}

export { TableSchemaProvider };
