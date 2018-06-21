import React from 'react';
import TestUtils from 'react-dom/test-utils';
import renderer from 'react-test-renderer';

import { Form, Field, FieldArray, SchemaContext } from '../../src';

it('As a developer, I can prefill implemented from with default values from table schema.', () => {
  const tableSchema = {
    name: 'tableSchema',
    displayName: 'tableSchema',
    isSystem: false,
    fields: [{
      name: 'field',
      displayName: 'Text Required Unformatted Field',
      description: null,
      fieldType: 'TEXT',
      fieldTypeAttributes: {
        format: 'UNFORMATTED',
        fieldSize: 100,
      },
      isList: false,
      isRequired: true,
      isUnique: false,
      defaultValue: 'Default Value',
      relation: null,
    }],
  };

  const TestFieldComponent = jest.fn(() => null);

  const form = renderer.create(
    <Form onSubmit={ jest.fn() } tableSchema={ tableSchema } prefillInitialValues>
      {
        ({ handleSubmit }) => (
          <form onSubmit={ handleSubmit }>
            <Field fieldSchemaName={ tableSchema.fields[0].name } component={ TestFieldComponent } />
          </form>
        )
      }
    </Form>,
  );

  expect(TestFieldComponent).toHaveBeenCalledTimes(1);
  expect(TestFieldComponent.mock.calls[0][0].input.value).toEqual('Default Value');
});

it('As a developer, I can get access to schema of the each field in the field component.', () => {
  const tableSchema = {
    name: 'tableSchema',
    displayName: 'tableSchema',
    isSystem: false,
    fields: [{
      name: 'field',
      displayName: 'Text Required Unformatted Field',
      description: null,
      fieldType: 'TEXT',
      fieldTypeAttributes: {
        format: 'UNFORMATTED',
        fieldSize: 100,
      },
      isList: false,
      isRequired: false,
      isUnique: false,
      defaultValue: 'Default Value',
      relation: null,
    }],
  };

  const TestFieldComponent = jest.fn(() => null);

  const form = renderer.create(
    <Form onSubmit={ jest.fn() } tableSchema={ tableSchema }>
      {
        ({ handleSubmit }) => (
          <form onSubmit={ handleSubmit }>
            <Field fieldSchemaName={ tableSchema.fields[0].name } component={ TestFieldComponent } />
          </form>
        )
      }
    </Form>,
  );

  expect(TestFieldComponent).toHaveBeenCalledTimes(1);
  expect(TestFieldComponent.mock.calls[0][0].fieldSchema).toEqual(tableSchema.fields[0]);
});

it('As a developer, I can get access to table schema from the render props.', () => {
  const tableSchema = {
    name: 'tableSchema',
    displayName: 'tableSchema',
    isSystem: false,
    fields: [{
      name: 'field',
      displayName: 'Text Required Unformatted Field',
      description: null,
      fieldType: 'TEXT',
      fieldTypeAttributes: {
        format: 'UNFORMATTED',
        fieldSize: 100,
      },
      isList: false,
      isRequired: false,
      isUnique: false,
      defaultValue: 'Default Value',
      relation: null,
    }],
  };

  const TestFieldComponent = jest.fn(() => null);

  const renderProp = jest.fn(({ handleSubmit }) => (
    <form onSubmit={ handleSubmit }>
      <Field fieldSchemaName={ tableSchema.fields[0].name } component={ TestFieldComponent } />
    </form>
  ));

  const form = renderer.create(
    <Form onSubmit={ jest.fn() } tableSchema={ tableSchema }>
      { renderProp }
    </Form>,
  );

  expect(renderProp).toHaveBeenCalledTimes(1);
  expect(renderProp.mock.calls[0][0].tableSchema).toEqual(tableSchema);
});

it('As a developer, I can get access to validation errors from field components.', () => {
  const TestFieldComponent = jest.fn(() => null);

  const onSubmit = jest.fn();

  const tableSchema = {
    name: 'tableSchema',
    displayName: 'tableSchema',
    isSystem: false,
    fields: [{
      name: 'field',
      displayName: 'Text Required Unformatted Field',
      description: null,
      fieldType: 'TEXT',
      fieldTypeAttributes: {
        format: 'UNFORMATTED',
        fieldSize: 100,
      },
      isList: false,
      isRequired: true,
      isUnique: false,
      defaultValue: null,
      relation: null,
    }, {
      name: 'fieldArray',
      displayName: 'List of Text Required Unformatted Fields',
      description: null,
      fieldType: 'TEXT',
      fieldTypeAttributes: {
        format: 'UNFORMATTED',
        fieldSize: 2,
      },
      isList: true,
      isRequired: true,
      isUnique: false,
      defaultValue: null,
      relation: null,
    }],
  };

  const form = TestUtils.renderIntoDocument(
    <Form onSubmit={ onSubmit } tableSchema={ tableSchema } initialValues={{ fieldArray: ['Award'] }}>
      {
        ({ handleSubmit }) => (
          <form onSubmit={ handleSubmit }>
            <Field fieldSchemaName={ tableSchema.fields[0].name } component={ TestFieldComponent } />
            <FieldArray fieldSchemaName={ tableSchema.fields[1].name }>
              {
                ({ fields }) => (
                  fields.map((name) => (
                    <Field key={ name } fieldSchemaName={ tableSchema.fields[1].name } name={ name } component={ TestFieldComponent } />
                  ))
                )
              }
            </FieldArray>
            <button type="onSubmit" />
          </form>
        )
      }
    </Form>,
  );

  submitForm(form);

  expect(onSubmit).toHaveBeenCalledTimes(0);

  expect(TestFieldComponent).toHaveBeenCalledTimes(6);
  expect(TestFieldComponent.mock.calls[4][0].meta.error).toEqual('Value is required');
  expect(TestFieldComponent.mock.calls[5][0].meta.error).toEqual('Maximum allowed field size is 2. It was exceeded.');
});

it('As a developer, I can pass table schema to multiple forms via schema context provider.', () => {
  const schema = [{
    name: 'tableSchema',
    displayName: 'tableSchema',
    isSystem: false,
    fields: [{
      name: 'field',
      displayName: 'Text Required Unformatted Field',
      description: null,
      fieldType: 'TEXT',
      fieldTypeAttributes: {
        format: 'UNFORMATTED',
        fieldSize: 100,
      },
      isList: false,
      isRequired: true,
      isUnique: false,
      defaultValue: null,
      relation: null,
    }],
  }];

  const form = renderer.create(
    <SchemaContext.Provider value={{ schema }}>
      <Form onSubmit={ jest.fn() } tableSchemaName="tableSchema" initialValues={{ field: 'caupones' }}>
        {
          ({ handleSubmit }) => (
            <form onSubmit={ handleSubmit }>
              <Field fieldSchemaName={ schema[0].fields[0].name } component="input" />
            </form>
          )
        }
      </Form>
      <Form onSubmit={ jest.fn() } tableSchemaName="tableSchema" initialValues={{ field: 'tubiporous' }}>
        {
          ({ handleSubmit }) => (
            <form onSubmit={ handleSubmit }>
              <Field fieldSchemaName={ schema[0].fields[0].name } component="input" />
            </form>
          )
        }
      </Form>
    </SchemaContext.Provider>,
  );

  expect(form.toJSON()).toMatchSnapshot();
});
