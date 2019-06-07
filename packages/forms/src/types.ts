import React from 'react';
import { FormApi, FieldState as FinalFieldState } from 'final-form';
import { FormProps as FinalFormProps, FieldProps as FinalFieldProps } from 'react-final-form';
import { FieldArrayProps as FinalFieldArrayProps } from 'react-final-form-arrays';
import { FieldType, TableSchema, FieldSchema, Schema } from '@8base/utils';
import { PreparedValidator } from '@8base/validate';


type SchemaContextValue = Schema;

type RenderableProps = {
  component?: React.ComponentType<any>,
  children?: ((props: Object) => React.ReactNode) | React.ReactNode,
  render?: (props: Object) => React.ReactNode,
};

type FormContextValue = {
  tableSchema?: TableSchema,
};

type FormProps = {
  tableSchemaName?: string,
  type?: 'CREATE' | 'UPDATE',
  ignoreNonTableFields?: boolean,
  formatRelationToIds?: boolean,
  permissions?: any,
  onSuccess?: (result: any, form: FormApi) => void,
} & FinalFormProps;

type FieldsetProps = {
  tableSchemaName?: string,
} & RenderableProps;

type FieldProps = {
  validate?: (value: any, allValues: Object, meta: FinalFieldState | null, validateFieldSchema: PreparedValidator) => any,
} & FinalFieldProps<any>;

export {
  FieldProps,
  FieldSchema,
  FieldsetProps,
  FieldType,
  FormContextValue,
  FormProps,
  Schema,
  SchemaContextValue,
  TableSchema,
  RenderableProps,
};
