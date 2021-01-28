import React from 'react';
import { FormApi } from 'final-form';
import { FormProps as FinalFormProps, FieldProps as FinalFieldProps } from 'react-final-form';
import { FieldType, TableSchema, FieldSchema, Schema } from '@8base/utils';

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

type FormProps<FormValues = any> = {
  tableSchemaName?: string;
  appName?: string;
  type?: 'CREATE' | 'UPDATE';
  ignoreNonTableFields?: boolean;
  formatRelationToIds?: boolean;
  permissions?: any;
  onSuccess?: (result: any, form: FormApi) => void;
  beforeFormatDataForMutation?: <T_OUT = object>(formValues: FormValues) => T_OUT;
  afterFormatDataForMutation?: <T_IN = object, T_OUT = object>(data: T_IN) => T_OUT;
  beforeFormatQueryData?: <T_IN = object, T_OUT = object>(data: T_IN) => T_OUT;
  afterFormatQueryData?: <T = object>(data: T) => FormValues;
} & FinalFormProps<FormValues>;

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
  TableSchema,
  RenderableProps,
};
