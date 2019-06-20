import React from 'react';
import { compose, setDisplayName } from 'recompose';

import { FormContext } from './FormContext';
import { withTableSchema, renderComponent, WithTableSchemaProps } from './utils';
import { FieldsetProps, FormContextValue } from './types';

const enhacner: any = compose(
  withTableSchema,
  setDisplayName('Fieldset'),
);

/**
 * `Fieldset` passes relation table schema to the children fields.
 * @prop {TableSchema} [tableSchema] - The 8base API table schema.
 * @prop {string} [tableSchemaName] - The name of the 8base API table schema. Worked only if you provide schema by `SchemaContext`.
 */
const Fieldset: React.ComponentType<FieldsetProps> = enhacner(
  class Fieldset extends React.Component<FieldsetProps & WithTableSchemaProps> {
    public collectContextValue = (): FormContextValue => {
      const { tableSchema } = this.props;

      return { tableSchema };
    };

    public render() {
      const contextValue: FormContextValue = this.collectContextValue();

      const rendered = renderComponent(this.props);

      return <FormContext.Provider value={contextValue}>{rendered}</FormContext.Provider>;
    }
  },
);

export { Fieldset };
