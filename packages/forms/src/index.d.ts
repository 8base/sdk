import { FieldProps, FormProps, FormSpyProps } from 'react-final'
import { FieldArrayProps } from 'react-final-form-arrays';


export const Field: React.ComponentType<FieldProps>

export const FieldArrayProps: React.ComponentType<FieldArrayProps>

export const Form: React.ComponentType<FormProps & {
  type: 'CREATE' | 'UPDATE',
  tableSchemaName: string
}>

export const FormSpy: React.ComponentType<FormSpyProps>
