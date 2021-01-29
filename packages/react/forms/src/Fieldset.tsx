import React, { useContext } from 'react';
import * as R from 'ramda';
import { tablesListSelectors, TableSchema } from '@8base/utils';
import { TableSchemaContext } from '@8base-react/table-schema-provider';

import { FormContext } from './FormContext';
import { renderComponent } from './utils';
import { FieldsetProps } from './types';

/**
 * `Fieldset` passes relation table schema to the children fields.
 * @prop {string} [tableSchemaName] - The name of the 8base API table schema. Worked only if you provide schema by `SchemaContext`.
 */
const Fieldset = ({ tableSchemaName, ...props }: FieldsetProps) => {
  const { appName } = useContext(FormContext);
  const { tablesList } = useContext(TableSchemaContext);

  let tableSchema: TableSchema | void;

  if (tableSchemaName && tablesList) {
    tableSchema = tablesListSelectors.getTableByName(tablesList, tableSchemaName, appName);
  }

  props = R.assoc('tableSchema', tableSchema, props);

  return <FormContext.Provider value={{ tableSchema }}>{renderComponent(props)}</FormContext.Provider>;
};

export { Fieldset };
