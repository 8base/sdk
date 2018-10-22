//@flow

import { formatDataForMutation, MUTATION_TYPE } from '../../src';

const SCHEMA = [{
  id: 'TABLE_SCHEMA_ID',
  name: 'tableSchema',
  displayName: 'Table Schema',
  isSystem: false,
  fields: [
    {
      name: 'meta',
      displayName: 'meta',
      description: null,
      fieldType: 'TEXT',
      fieldTypeAttributes: {
        format: 'UNFORMATTED',
        fieldSize: 100,
      },
      isMeta: true,
      isList: false,
      isRequired: false,
      isUnique: false,
      defaultValue: null,
      relation: null,
    },
    {
      name: 'address',
      displayName: 'Address',
      description: null,
      fieldType: 'CUSTOM',
      fieldTypeAttributes: {
        innerFields: [
          {
            name: 'street1',
            displayName: 'Street 1',
            description: null,
            fieldType: 'TEXT',
            isList: false,
            isRequired: true,
            isUnique: false,
            fieldTypeAttributes: {
              format: 'UNFORMATTED',
              fieldSize: 255,
            },
          },
          {
            name: 'street2',
            displayName: 'Street 2',
            description: null,
            fieldType: 'TEXT',
            isList: false,
            isRequired: false,
            isUnique: false,
            fieldTypeAttributes: {
              format: 'UNFORMATTED',
              fieldSize: 255,
            },
          },
          {
            name: 'zip',
            displayName: 'Zip',
            description: null,
            fieldType: 'TEXT',
            isList: false,
            isRequired: false,
            isUnique: false,
            fieldTypeAttributes: {
              format: 'UNFORMATTED',
              fieldSize: 255,
            },
          },
          {
            name: 'city',
            displayName: 'City',
            description: null,
            fieldType: 'TEXT',
            isList: false,
            isRequired: true,
            isUnique: false,
            fieldTypeAttributes: {
              format: 'UNFORMATTED',
              fieldSize: 255,
            },
          },
          {
            name: 'state',
            displayName: 'State',
            description: null,
            fieldType: 'TEXT',
            isList: false,
            isRequired: false,
            isUnique: false,
            fieldTypeAttributes: {
              format: 'UNFORMATTED',
              fieldSize: 255,
            },
          },
        ],
      },
      isList: false,
      isRequired: false,
      isUnique: null,
      defaultValue: null,
      isSystem: false,
      isMeta: false,
      relation: null,
    },
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
      name: 'file',
      displayName: 'File',
      description: null,
      fieldType: 'FILE',
      fieldTypeAttributes: {
        format: 'FILE',
        showTitle: null,
        showUrl: null,
        maxSize: null,
        typeRestrictions: null,
      },
      isList: false,
      isRequired: false,
      isUnique: null,
      defaultValue: null,
      isSystem: false,
      isMeta: false,
      relation: null,
    },
    {
      name: 'fileList',
      displayName: 'File List',
      description: null,
      fieldType: 'FILE',
      fieldTypeAttributes: {
        format: 'FILE',
        showTitle: null,
        showUrl: null,
        maxSize: null,
        typeRestrictions: null,
      },
      isList: true,
      isRequired: false,
      isUnique: null,
      defaultValue: null,
      isSystem: false,
      isMeta: false,
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
}, {
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
    {
      name: 'nestedRelation',
      displayName: 'Nested Relation',
      description: null,
      fieldType: 'RELATION',
      fieldTypeAttributes: null,
      isList: false,
      isRequired: false,
      isUnique: null,
      defaultValue: null,
      relation: {
        id: 'RELATION_FIELD_ID_5',
        relationTableName: 'RELATION_TABLE_NAME_3',
        relationFieldName: 'aid',
        refTable: {
          id: 'NESTED_RELATION_TABLE_SCHEMA_ID',
        },
        refFieldIsList: false,
        refFieldIsRequired: true,
      },
    },
    {
      name: 'nestedRelationList',
      displayName: 'Nested Relation List',
      description: null,
      fieldType: 'RELATION',
      fieldTypeAttributes: null,
      isList: true,
      isRequired: false,
      isUnique: null,
      defaultValue: null,
      relation: {
        id: 'RELATION_FIELD_ID_6',
        relationTableName: 'RELATION_TABLE_NAME_4',
        relationFieldName: 'aid',
        refTable: {
          id: 'NESTED_RELATION_TABLE_SCHEMA_ID',
        },
        refFieldIsList: false,
        refFieldIsRequired: true,
      },
    },
  ],
}, {
  id: 'NESTED_RELATION_TABLE_SCHEMA_ID',
  name: 'nestedRelationTableSchema',
  displayName: 'Other Relation Table Schema',
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
      name: 'nestedRelation',
      displayName: 'Nested Relation',
      description: null,
      fieldType: 'RELATION',
      fieldTypeAttributes: null,
      isList: false,
      isRequired: false,
      isUnique: null,
      defaultValue: null,
      relation: {
        id: 'RELATION_FIELD_ID_5',
        relationTableName: 'RELATION_TABLE_NAME_3',
        relationFieldName: 'aid',
        refTable: {
          id: 'RELATION_TABLE_SCHEMA_ID',
        },
        refFieldIsList: false,
        refFieldIsRequired: true,
      },
    },
    {
      name: 'nestedRelationList',
      displayName: 'Nested Relation List',
      description: null,
      fieldType: 'RELATION',
      fieldTypeAttributes: null,
      isList: true,
      isRequired: false,
      isUnique: null,
      defaultValue: null,
      relation: {
        id: 'RELATION_FIELD_ID_6',
        relationTableName: 'RELATION_TABLE_NAME_4',
        relationFieldName: 'aid',
        refTable: {
          id: 'RELATION_TABLE_SCHEMA_ID',
        },
        refFieldIsList: false,
        refFieldIsRequired: true,
      },
    },
  ],
}];

describe('As developer, I can format for create mutation,', () => {
  it('Flat data.', () => {
    const data = {
      scalar: 'Scalar Value',
      scalarList: ['Scalar List Value'],
    };

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, 'tableSchema', data, SCHEMA)).toEqual(data);
  });

  it('Data with relation reference.', () => {
    const data = {
      relation: '5b32159b66a4500f96285626',
    };

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, 'tableSchema', data, SCHEMA)).toEqual({
      relation: {
        connect: { id: '5b32159b66a4500f96285626' },
      },
    });
  });

  it('Data with relation.', () => {
    const data = {
      relation: {
        scalar: 'Relation Scalar Value',
        scalarList: [
          'Relation Scalar List Value',
        ],
      },
    };

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, 'tableSchema', data, SCHEMA)).toEqual({
      relation: {
        create: {
          scalar: 'Relation Scalar Value',
          scalarList: [
            'Relation Scalar List Value',
          ],
        },
      },
    });
  });

  it('Data with null relation.', () => {
    const data = {
      relation: null,
    };

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, 'tableSchema', data, SCHEMA)).toEqual({
      relation: null,
    });
  });

  it('Data with file reference.', () => {
    const data = {
      file: '5b32159b66a4500f96285626',
    };

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, 'tableSchema', data, SCHEMA)).toEqual({
      file: {
        connect: { id: '5b32159b66a4500f96285626' },
      },
    });
  });

  it('Data with file object.', () => {
    const file = {
      fileId: 'file-id',
      filename: 'Screenshot at авг. 13 15-22-49.png',
    };

    const data = {
      file,
    };

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, 'tableSchema', data, SCHEMA)).toEqual({
      file: {
        create: file,
      },
    });
  });

  it('Data with relation list reference.', () => {
    const data = {
      relationList: [
        '5b32159b66a450c047285628',
        '5b32159b66a450fae928562a',
      ],
    };

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, 'tableSchema', data, SCHEMA)).toEqual({
      relationList: {
        connect: [
          { id: '5b32159b66a450c047285628' },
          { id: '5b32159b66a450fae928562a' },
        ],
      },
    });
  });

  it('Data with relation list.', () => {
    const data = {
      relationList: [{
        scalar: 'Relation List Scalar Value',
        scalarList: [
          'Relation List Scalar List Value',
        ],
      }],
    };

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, 'tableSchema', data, SCHEMA)).toEqual({
      relationList: {
        create: [{
          scalar: 'Relation List Scalar Value',
          scalarList: [
            'Relation List Scalar List Value',
          ],
        }],
      },
    });
  });

  it('Data with file list reference.', () => {
    const data = {
      fileList: ['5b32159b66a4500f96285626'],
    };

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, 'tableSchema', data, SCHEMA)).toEqual({
      fileList: {
        connect: [{ id: '5b32159b66a4500f96285626' }],
      },
    });
  });

  it('Data with list of the file objects.', () => {
    const fileList = [{
      fileId: 'file-id',
      filename: 'Screenshot at авг. 13 15-22-49.png',
    }];

    const data = {
      fileList,
    };

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, 'tableSchema', data, SCHEMA)).toEqual({
      fileList: {
        create: fileList,
      },
    });
  });

  it('Compelex data.', () => {
    const data = {
      scalar: 'Scalar Value',
      scalarList: [
        'Scalar List Value',
      ],
      relation: {
        scalar: 'Relation Scalar Value',
      },
      relationList: [{
        scalar: 'Relation List Scalar Value',
        scalarList: [
          'Relation List Scalar List Value',
        ],
        nestedRelation: '5b32159b66a450c047285628',
        nestedRelationList: [{
          scalar: 'Relation List Nested Relation List Scalar Value',
          scalarList: [
            'Relation List Nested Relation List Scalar List Value',
          ],
        }],
      }],
    };

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, 'tableSchema', data, SCHEMA)).toMatchSnapshot();
  });
});

describe('As developer, I can format for update mutation,', () => {
  it('Flat data.', () => {
    const data = {
      scalar: 'Scalar Value',
      scalarList: ['Scalar List Value'],
    };

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, 'tableSchema', data, SCHEMA)).toEqual(data);
  });

  it('Data with relation reference.', () => {
    const data = {
      relation: '5b32159b66a4500f96285626',
    };

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, 'tableSchema', data, SCHEMA)).toEqual({
      relation: {
        reconnect: { id: '5b32159b66a4500f96285626' },
      },
    });
  });

  it('Data with relation.', () => {
    const data = {
      relation: {
        scalar: 'Relation Scalar Value',
        scalarList: [
          'Relation Scalar List Value',
        ],
      },
    };

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, 'tableSchema', data, SCHEMA)).toEqual({
      relation: {
        create: {
          scalar: 'Relation Scalar Value',
          scalarList: [
            'Relation Scalar List Value',
          ],
        },
      },
    });
  });

  it('Data with null relation.', () => {
    const data = {
      relation: null,
    };

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, 'tableSchema', data, SCHEMA)).toEqual({
      relation: null,
    });
  });

  it('Data with file object.', () => {
    const file = {
      fileId: 'file-id',
      filename: 'Screenshot at авг. 13 15-22-49.png',
    };

    const data = {
      file,
    };

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, 'tableSchema', data, SCHEMA)).toEqual({
      file: {
        create: file,
      },
    });
  });

  it('Data with file object with existed id.', () => {
    const file = {
      id: '5b32159b66a4500f96285626',
      fileId: 'file-id',
      filename: 'Screenshot at авг. 13 15-22-49.png',
    };

    const data = {
      file,
    };

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, 'tableSchema', data, SCHEMA)).toEqual({
      file: {
        reconnect: { id: file.id },
      },
    });
  });

  it('Data with file reference.', () => {
    const data = {
      file: '5b32159b66a4500f96285626',
    };

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, 'tableSchema', data, SCHEMA)).toEqual({
      file: {
        reconnect: { id: '5b32159b66a4500f96285626' },
      },
    });
  });

  it('Data with file list reference.', () => {
    const data = {
      fileList: ['5b32159b66a4500f96285626'],
    };

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, 'tableSchema', data, SCHEMA)).toEqual({
      fileList: {
        reconnect: [{ id: '5b32159b66a4500f96285626' }],
      },
    });
  });

  it('Data with relation list reference.', () => {
    const data = {
      relationList: [
        '5b32159b66a450c047285628',
        '5b32159b66a450fae928562a',
      ],
    };

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, 'tableSchema', data, SCHEMA)).toEqual({
      relationList: {
        reconnect: [
          { id: '5b32159b66a450c047285628' },
          { id: '5b32159b66a450fae928562a' },
        ],
      },
    });
  });

  it('Data with relation list.', () => {
    const data = {
      relationList: [{
        scalar: 'Relation List Scalar Value',
        scalarList: [
          'Relation List Scalar List Value',
        ],
      }],
    };

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, 'tableSchema', data, SCHEMA)).toEqual({
      relationList: {
        create: [{
          scalar: 'Relation List Scalar Value',
          scalarList: [
            'Relation List Scalar List Value',
          ],
        }],
      },
    });
  });

  it('Compelex data.', () => {
    const data = {
      meta: 'meta',
      address: {
        street1: 'Pamelia Quall',
        street2: 'Lasonya Friedly',
        zip: 'Timothy Ingleton',
        city: 'Kenia Urhahn',
        state: 'Scottie Swailes',
      },
      scalar: 'Scalar Value',
      scalarList: [
        'Scalar List Value',
      ],
      relation: {
        scalar: 'Relation Scalar Value',
      },
      relationList: [{
        scalar: 'Relation List Scalar Value',
        scalarList: [
          'Relation List Scalar List Value',
        ],
        nestedRelation: '5b32159b66a450c047285628',
        nestedRelationList: [{
          scalar: 'Relation List Nested Relation List Scalar Value',
          scalarList: [
            'Relation List Nested Relation List Scalar List Value',
          ],
        }],
      }],
      _description: 'Description',
      __typename: 'Address',
    };

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, 'tableSchema', data, SCHEMA)).toMatchSnapshot();
  });
});
