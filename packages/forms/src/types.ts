import React from 'react';
import { FormApi, FieldState as FinalFieldState } from 'final-form';
import { FormProps as FinalFormProps, FieldProps as FinalFieldProps } from 'react-final-form';
import { FieldArrayProps as FinalFieldArrayProps } from 'react-final-form-arrays';
import { FieldType, TableSchema, FieldSchema, Schema } from '@8base/utils';
import { PreparedValidator } from '@8base/validate';

type SchemaContextValue = Schema;

type RenderableProps = {
  component?: React.ComponentType<any>;
  children?: ((props: object) => React.ReactNode) | React.ReactNode;
  render?: (props: object) => React.ReactNode;
};

type FormContextValue = {
  tableSchema?: TableSchema | void;
  appName?: string;
  loading?: boolean;
};

type FormProps = {
  tableSchemaName?: string;
  appName?: string;
  type?: 'CREATE' | 'UPDATE';
  ignoreNonTableFields?: boolean;
  formatRelationToIds?: boolean;
  permissions?: any;
  onSuccess?: (result: any, form: FormApi) => void;
} & FinalFormProps;

type FieldsetProps = {
  tableSchemaName?: string;
} & RenderableProps;

type FieldProps = FinalFieldProps<any, any>;

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
