import React from 'react';
import * as R from 'ramda';
import { ApolloError, gql } from '@apollo/client';
// TODO: apollo Query component is deprecated
import { Query } from '@apollo/client/react/components';
import { TableSchema, Application } from '@8base/utils';

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
      ...GeoFieldTypeAttributes
    }
  }

  fragment CommonTableFieldFragment on TableField {
    id
    name
    displayName
    table {
      id
      name
      displayName
    }
    description
    fieldType
    fieldTypeAttributes {
      ...TextFieldTypeAttributes
      ...NumberFieldTypeAttributes
      ...FileFieldTypeAttributes
      ...DateFieldTypeAttributes
      ...SwitchFieldTypeAttributes
      ...MissingRelationFieldTypeAttributes
      ...GeoFieldTypeAttributes
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
        displayName
      }
      refField {
        id
        name
        displayName
      }
      refFieldIsList
      refFieldIsRequired
    }
    schemaFeatures {
      update
      delete
    }
    dataFeatures {
      create
      update
    }
    computedMode
    expression
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
    autoIncrement
  }

  fragment FileFieldTypeAttributes on FileFieldTypeAttributes {
    format
    maxSize
    typeRestrictions
  }

  fragment GeoFieldTypeAttributes on GeoFieldTypeAttributes {
    format
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
        ...GeoFieldTypeAttributes
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
    description
    application {
      id
      name
      displayName
      description
      status
      appType
    }
    indexes {
      id
      type
      columns {
        name
      }
      name
      isSystem
    }
    origin {
      type
      provider
    }
    isSystem
    fields {
      ...TableFieldFragment
    }
    attributes {
      ...TableAttributesFragment
    }
    schemaFeatures {
      create {
        DATE
        FILE
        JSON
        NUMBER
        RELATION
        SMART
        SWITCH
        TEXT
        UUID
        GEO
      }
      update {
        displayName
        name
      }
    }
    dataFeatures {
      create
      update
      delete
    }
  }

  fragment TableAttributesFragment on TableAttributes {
    ...TableViewAttributesFragment
  }

  fragment TableViewAttributesFragment on ViewAttributes {
    query
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

type TableSchemaProviderCommonProps = {
  tablesList?: TableSchema[];
  applicationsList?: Application[];
};

type TableSchemaProviderProps =
  | ({
      children: React.ReactNode;
    } & TableSchemaProviderCommonProps)
  | ({
      children: (props: { loading: boolean; error?: ApolloError }) => React.ReactNode;
    } & TableSchemaProviderCommonProps);

/**
 * Provider for 8base table schemas
 * @property {Function} children Children of the provider. Could be either react node or function with loading state.
 */
class TableSchemaProvider extends React.Component<TableSchemaProviderProps> {
  public renderChildren = (args: { loading: boolean; error?: ApolloError }) => {
    const { children } = this.props;

    if (typeof children === 'function') {
      return children(args);
    }

    return children;
  };

  public renderContent = (
    { data, loading, error }: { data?: any; loading: boolean; error?: ApolloError } = { loading: false },
  ) => {
    return (
      <TableSchemaContext.Provider
        value={{
          tablesList: R.pathOr([], ['tablesList', 'items'], data),
          applicationsList: R.pathOr([], ['applicationsList', 'items'], data),
          loading,
          error,
        }}
      >
        {this.renderChildren({ loading, error })}
      </TableSchemaContext.Provider>
    );
  };

  public render() {
    const { children, tablesList, applicationsList, ...rest } = this.props;

    if (tablesList) {
      return (
        <TableSchemaContext.Provider
          value={{
            tablesList,
            applicationsList: applicationsList || [],
            loading: false,
          }}
        >
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
