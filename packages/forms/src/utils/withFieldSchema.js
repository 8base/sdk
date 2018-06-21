// @flow
import * as React from 'react';

import { FormContext } from '../FormContext';
import { getFieldSchema } from './getFieldSchema';
import { logError } from './logError';
import type { FieldSchema, FormContextValue } from '../types';

type FieldSchemaConsumerProps = {
  fieldSchemaName?: string,
};

const withFieldSchema = (BaseComponent: React.ComponentType<*>) => {
  class FieldSchemaConsumer extends React.Component<FieldSchemaConsumerProps> {
    renderWithFormSchema = (context: ?FormContextValue) => {
      const { fieldSchemaName, ...restProps } = this.props;

      let rendered = null;

      if (context && context.tableSchema && fieldSchemaName) {
        const fieldSchema: ?FieldSchema = getFieldSchema(context.tableSchema, fieldSchemaName);

        if (fieldSchema) {
          rendered = <BaseComponent { ...restProps } fieldSchema={ fieldSchema } />;
        } else {
          logError(`Error: table schema ${context.tableSchema.name} doesn't contain field schema with ${fieldSchemaName} name.`);
        }
      } else {
        logError('Error: can\'t find table schema in the form context.');
      }

      return rendered;
    }

    render() {
      const { fieldSchemaName, ...restProps } = this.props;

      let rendered = null;

      if (fieldSchemaName) {
        rendered = <FormContext.Consumer>{ this.renderWithFormSchema }</FormContext.Consumer>;
      } else {
        rendered = <BaseComponent { ...restProps } />;
      }

      return rendered;
    }
  }

  return FieldSchemaConsumer;
};

export { withFieldSchema };
