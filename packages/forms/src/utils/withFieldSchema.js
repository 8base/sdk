// @flow
import React from 'react';

import { FormContext } from '../FormContext';
import { getFieldSchemaName } from './getFieldSchemaName';
import { getFieldSchema } from './getFieldSchema';
import { logWarning } from './log';
import type { FieldSchema, FormContextValue } from '../types';

type FieldSchemaConsumerProps = {
  name?: string,
};

const withFieldSchema = (BaseComponent: React$ComponentType<*>) => {
  class FieldSchemaConsumer extends React.Component<FieldSchemaConsumerProps> {
    renderWithFormSchema = (context?: FormContextValue) => {
      const { name } = this.props;

      if (context && context.tableSchema && name) {
        const { tableSchema } = context;
        const fieldSchemaName = getFieldSchemaName(name);

        const fieldSchema: ?FieldSchema = getFieldSchema(tableSchema, fieldSchemaName);

        if (fieldSchema) {
          return <BaseComponent { ...this.props } fieldSchema={ fieldSchema } />;
        }

        logWarning(`table schema ${tableSchema && tableSchema.name} doesn't contain field schema with \`${fieldSchemaName}\` name for \`${name}\` field.`);
      }

      return <BaseComponent { ...this.props } />;
    }

    render() {
      return (
        <FormContext.Consumer>
          { this.renderWithFormSchema }
        </FormContext.Consumer>
      );
    }
  }

  return FieldSchemaConsumer;
};

export { withFieldSchema };
