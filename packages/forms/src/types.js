// @flow
import type { FormProps as FinalFormProps, FieldProps as FinalFieldProps } from 'react-final-form';
import type { FieldArrayProps as FinalFieldArrayProps } from 'react-final-form-arrays';

type FieldType = 'TEXT' | 'NUMBER' | 'DATE' | 'SWITCH' | 'ID';

type FieldSchema = {
  name: string,
  displayName?: string,
  description: ?string,
  fieldType: FieldType,
  fieldTypeAttributes: Object,
  isList: boolean,
  isRequired: boolean,
  isUnique: boolean,
  defaultValue: any,
  relation: ?Object,
};

type TableSchema = {
  name: string,
  displayName?: string,
  isSystem: boolean,
  fields: Array<FieldSchema>,
};

type Schema = Array<TableSchema>;

type SchemaContextValue = {
  schema: Schema,
};

type FormContextValue = {|
  tableSchema: TableSchema,
|};

type FormProps = {
  tableSchema: TableSchema,
  prefillInitialValues?: boolean,
} & FinalFormProps;

type FieldProps = {
  fieldSchema: FieldSchema,
} & FinalFieldProps;

type FieldArrayProps = FinalFieldArrayProps;

export type {
  FieldArrayProps,
  FieldProps,
  FieldSchema,
  FieldType,
  FormContextValue,
  FormProps,
  Schema,
  SchemaContextValue,
  TableSchema,
};
