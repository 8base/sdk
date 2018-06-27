// @flow
import React from 'react';

import { FormContext } from '../FormContext';
import { getFieldSchemaName } from './getFieldSchemaName';
import { getFieldSchema } from './getFieldSchema';
import { logError } from './logError';
import type { FieldSchema, FormContextValue } from '../types';

type FieldSchemaConsumerProps = {
  name?: string,
};

const withFieldSchema = (BaseComponent: React$ComponentType<*>) => {
  class FieldSchemaConsumer extends React$Component<FieldSchemaConsumerProps> {
    renderWithFormSchema = (context: ?FormContextValue) => {
      const { name, ...restProps } = this.props;

      let rendered = null;

      if (context && context.tableSchema && name) {
        const fieldSchemaName = getFieldSchemaName(name);

        const fieldSchema: ?FieldSchema = getFieldSchema(context.tableSchema, fieldSchemaName);

        if (fieldSchema) {
          rendered = <BaseComponent { ...restProps } name={ name } fieldSchema={ fieldSchema } />;
        } else {
          logError(`Error: table schema ${context.tableSchema.name} doesn't contain field schema with \`${fieldSchemaName}\` name for \`${name}\` field.`);
        }
      } else {
        logError('Error: can\'t find table schema in the form context.');
      }

      return rendered;
    }

    render() {
      const { name, ...restProps } = this.props;

      let rendered = null;

      if (name) {
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
