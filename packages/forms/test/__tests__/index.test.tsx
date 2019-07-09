import React from 'react';
import * as renderer from 'react-test-renderer';
import { TableSchemaContext } from '@8base/table-schema-provider';

import { Form, Field, Fieldset, FieldArray } from '../../src';

const TABLE_SCHEMA: any = {
  id: 'TABLE_SCHEMA_ID',
  name: 'tableSchema',
  displayName: 'Table Schema',
  isSystem: false,
  fields: [
    {
      name: 'scalar',
      displayName: 'Scalar',
      description: null,
      fieldType: 'TEXT',
      fieldTypeAttributes: {
        format: 'UNFORMATTED',
        fieldSize: 100,
      },
      isList: false,
      isRequired: false,
      isUnique: false,
      defaultValue: 'Scalar Default Value',
      relation: null,
    },
    {
      name: 'scalarList',
      displayName: 'Scalar List',
      description: null,
      fieldType: 'TEXT',
      fieldTypeAttributes: {
        format: 'UNFORMATTED',
        fieldSize: 100,
      },
      isList: true,
      isRequired: false,
      isUnique: false,
      defaultValue: 'Scalar List Default Value 1',
      relation: null,
    },
    {
      name: 'relation',
      displayName: 'Relation',
      description: null,
      fieldType: 'RELATION',
      fieldTypeAttributes: null,
      isList: false,
      isRequired: false,
      isUnique: null,
      defaultValue: null,
      relation: {
        id: 'RELATION_FIELD_ID_1',
        relationTableName: 'RELATION_TABLE_NAME_1',
        relationFieldName: 'aid',
        refTable: {
          id: 'RELATION_TABLE_SCHEMA_ID',
        },
        refFieldIsList: false,
        refFieldIsRequired: true,
      },
    },
    {
      name: 'relationList',
      displayName: 'RelationList',
      description: null,
      fieldType: 'RELATION',
      fieldTypeAttributes: null,
      isList: true,
      isRequired: false,
      isUnique: null,
      defaultValue: null,
      relation: {
        id: 'RELATION_FIELD_ID_2',
        relationTableName: 'RELATION_TABLE_NAME_2',
        relationFieldName: 'aid',
        refTable: {
          id: 'RELATION_TABLE_SCHEMA_ID',
        },
        refFieldIsList: false,
        refFieldIsRequired: true,
      },
    },
  ],
};

const RELATION_TABLE_SCHEMA: any = {
  id: 'RELATION_TABLE_SCHEMA_ID',
  name: 'relationTableSchema',
  displayName: 'Relation Table Schema',
  isSystem: false,
  fields: [
    {
      name: 'scalar',
      displayName: 'Scalar',
      description: null,
      fieldType: 'TEXT',
      fieldTypeAttributes: {
        format: 'UNFORMATTED',
        fieldSize: 100,
      },
      isList: false,
      isRequired: false,
      isUnique: false,
      defaultValue: 'Scalar Default Value',
      relation: null,
    },
    {
      name: 'scalarList',
      displayName: 'Scalar List',
      description: null,
      fieldType: 'TEXT',
      fieldTypeAttributes: {
        format: 'UNFORMATTED',
        fieldSize: 100,
      },
      isList: true,
      isRequired: false,
      isUnique: false,
      defaultValue: 'Scalar List Default Value 1',
      relation: null,
    },
    {
      name: 'relation',
      displayName: 'Relation',
      description: null,
      fieldType: 'RELATION',
      fieldTypeAttributes: null,
      isList: false,
      isRequired: false,
      isUnique: null,
      defaultValue: null,
      relation: {
        id: 'RELATION_FIELD_ID_3',
        relationTableName: 'RELATION_TABLE_NAME_1',
        relationFieldName: 'aid',
        refTable: {
          id: 'TABLE_SCHEMA_ID',
        },
        refFieldIsList: false,
        refFieldIsRequired: true,
      },
    },
    {
      name: 'relationList',
      displayName: 'RelationList',
      description: null,
      fieldType: 'RELATION',
      fieldTypeAttributes: null,
      isList: true,
      isRequired: false,
      isUnique: null,
      defaultValue: null,
      relation: {
        id: 'RELATION_FIELD_ID_4',
        relationTableName: 'RELATION_TABLE_NAME_2',
        relationFieldName: 'aid',
        refTable: {
          id: 'TABLE_SCHEMA_ID',
        },
        refFieldIsList: false,
        refFieldIsRequired: true,
      },
    },
  ],
};

let mockCreateValidate: any = null;

jest.mock('@8base/validate', () => (...args: any) => mockCreateValidate(...args));

describe('As a developer, while I implementet a form,', () => {
  mockCreateValidate = jest.fn(fieldSchema => () => fieldSchema.name);

  const INITIAL_VALUES = {
    scalar: 'Scalar Value',
    scalarList: ['Scalar List Value'],
    relation: {
      scalar: 'Relation Scalar Value',
    },
    relationList: [
      {
        scalar: 'Relation List Scalar Value',
      },
    ],
  };

  const TestForm = jest.fn((props, renderProp) => renderProp(props));
  const TestFieldset = jest.fn((props, renderProp) => renderProp(props));
  const TestField = jest.fn(props => <input {...props.input} />);

  const element = (
    <TableSchemaContext.Provider
      value={{ tablesList: [TABLE_SCHEMA, RELATION_TABLE_SCHEMA], applicationsList: [], loading: false }}
    >
      <Form tableSchemaName="tableSchema" initialValues={INITIAL_VALUES} onSubmit={jest.fn()}>
        {renderProps =>
          TestForm(renderProps, ({ handleSubmit }: any) => (
            <form onSubmit={handleSubmit}>
              <Field name="scalar" component={TestField} />
              <FieldArray name="scalarList">
                {({ fields }) => fields.map(name => <Field key={name} name={name} component={TestField} />)}
              </FieldArray>
              <Fieldset tableSchemaName="relationTableSchema">
                {renderProps => TestFieldset(renderProps, () => <Field name="relation.scalar" component={TestField} />)}
              </Fieldset>
              <FieldArray name="relationList">
                {({ fields }) =>
                  fields.map(name => (
                    <Fieldset tableSchemaName="relationTableSchema" key={name}>
                      {renderProps =>
                        TestFieldset(renderProps, () => <Field name={`${name}.scalar`} component={TestField} />)
                      }
                    </Fieldset>
                  ))
                }
              </FieldArray>
            </form>
          ))
        }
      </Form>
    </TableSchemaContext.Provider>
  );

  const form = renderer.create(element);

  form.update(element);

  it('Form should be rendered.', () => {
    expect(form.toJSON()).toMatchSnapshot();
    expect(TestForm).toHaveBeenCalledTimes(2);
    expect(TestFieldset).toHaveBeenCalledTimes(4);
    expect(TestField).toHaveBeenCalledTimes(8);
    expect(mockCreateValidate).toHaveBeenCalledTimes(8);
  });

  it('I can get access to the table schema from the form.', () => {
    expect(TestForm.mock.calls[0][0].tableSchema).toEqual(TABLE_SCHEMA);
  });

  it('I can get access to the table schema from the fieldset.', () => {
    expect(TestFieldset.mock.calls[0][0].tableSchema).toEqual(RELATION_TABLE_SCHEMA);
    expect(TestFieldset.mock.calls[1][0].tableSchema).toEqual(RELATION_TABLE_SCHEMA);
  });

  it('I can get access to the field schema from the scalar field.', () => {
    expect(TestField.mock.calls[0][0].fieldSchema).toEqual(TABLE_SCHEMA.fields[0]);
  });

  it('I can get access to the field schema from the scalar list field.', () => {
    expect(TestField.mock.calls[1][0].fieldSchema).toEqual(TABLE_SCHEMA.fields[1]);
  });

  it('I can get access to the field schema from the relation scalar field.', () => {
    expect(TestField.mock.calls[2][0].fieldSchema).toEqual(RELATION_TABLE_SCHEMA.fields[0]);
  });

  it('I can get access to the field schema from the relation scalar list field.', () => {
    expect(TestField.mock.calls[3][0].fieldSchema).toEqual(RELATION_TABLE_SCHEMA.fields[0]);
  });

  it('Initial value provides to the scalar field.', () => {
    expect(TestField.mock.calls[0][0].meta.initial).toEqual(INITIAL_VALUES.scalar);
  });

  it('Initial value provides to the scalar list field.', () => {
    expect(TestField.mock.calls[1][0].meta.initial).toEqual(INITIAL_VALUES.scalarList[0]);
  });

  it('Initial value provides to the relation scalar field.', () => {
    expect(TestField.mock.calls[2][0].meta.initial).toEqual(INITIAL_VALUES.relation.scalar);
  });

  it('Initial value provides to the relation scalar list field.', () => {
    expect(TestField.mock.calls[3][0].meta.initial).toEqual(INITIAL_VALUES.relationList[0].scalar);
  });

  it('Validate function for the scalar field should created by its schema.', () => {
    expect(mockCreateValidate).toHaveBeenNthCalledWith(1, TABLE_SCHEMA.fields[0]);
  });

  it('Validate function for the scalar list field should created by its schema.', () => {
    expect(mockCreateValidate).toHaveBeenNthCalledWith(2, TABLE_SCHEMA.fields[1]);
  });

  it('Validate function for the relation scalar field should created by its schema.', () => {
    expect(mockCreateValidate).toHaveBeenNthCalledWith(3, RELATION_TABLE_SCHEMA.fields[0]);
  });

  it('Validate function for the relation scalar list field should created by its schema.', () => {
    expect(mockCreateValidate).toHaveBeenNthCalledWith(4, RELATION_TABLE_SCHEMA.fields[0]);
  });

  it('I can access to the validatation error from the scalar field.', () => {
    expect(TestField.mock.calls[4][0].meta.error).toEqual(TABLE_SCHEMA.fields[0].name);
  });

  it('I can access to the validatation error from the scalar list field.', () => {
    expect(TestField.mock.calls[5][0].meta.error).toEqual(TABLE_SCHEMA.fields[1].name);
  });

  it('I can access to the validatation error from the relation scalar field.', () => {
    expect(TestField.mock.calls[6][0].meta.error).toEqual(RELATION_TABLE_SCHEMA.fields[0].name);
  });

  it('I can access to the validatation error from the relation scalar list field.', () => {
    expect(TestField.mock.calls[7][0].meta.error).toEqual(RELATION_TABLE_SCHEMA.fields[0].name);
  });
});
