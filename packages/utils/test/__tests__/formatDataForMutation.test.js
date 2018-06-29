//@flow

import { formatDataForMutation, MUTATION_TYPE } from '../../src';

const SCHEMA = [{
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
        connect: '5b32159b66a4500f96285626',
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
          '5b32159b66a450c047285628',
          '5b32159b66a450fae928562a',
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
        reconnect: '5b32159b66a4500f96285626',
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
          '5b32159b66a450c047285628',
          '5b32159b66a450fae928562a',
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

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, 'tableSchema', data, SCHEMA)).toMatchSnapshot();
  });
});
