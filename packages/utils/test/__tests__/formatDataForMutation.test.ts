import { formatDataForMutation, MUTATION_TYPE } from '../../src';
import { SCHEMA } from '../__fixtures__';

describe('As developer, I can format for create mutation,', () => {
  it('Flat data.', () => {
    const data = {
      scalar: 'Scalar Value',
      scalarList: ['Scalar List Value'],
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.CREATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual(data);
  });

  it('Data with empty number.', () => {
    const data = {
      number: '',
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.CREATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      number: null,
    });
  });

  it('Data with empty numbers.', () => {
    const data = {
      numberList: ['', null],
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.CREATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      numberList: [],
    });
  });

  it('Data with relation reference.', () => {
    const data = {
      relation: '5b32159b66a4500f96285626',
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.CREATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      relation: {
        connect: { id: '5b32159b66a4500f96285626' },
      },
    });
  });

  it('Data with relation.', () => {
    const data = {
      relation: {
        scalar: 'Relation Scalar Value',
        scalarList: ['Relation Scalar List Value'],
      },
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.CREATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      relation: {
        create: {
          scalar: 'Relation Scalar Value',
          scalarList: ['Relation Scalar List Value'],
        },
      },
    });
  });

  it('Data with null relation.', () => {
    const data = {
      relation: null,
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.CREATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      relation: {
        connect: {},
      },
    });
  });

  it('Data with null file.', () => {
    const data = {
      file: null,
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.CREATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      file: {
        connect: {},
      },
    });
  });

  it('Data with file reference.', () => {
    const data = {
      file: '5b32159b66a4500f96285626',
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.CREATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
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

    const nonFileFields = {
      nonFileField: 'non file field',
    };

    const data = {
      file: { ...file, ...nonFileFields },
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.CREATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      file: {
        create: file,
      },
    });
  });

  it('Data with relation list reference.', () => {
    const data = {
      relationList: ['5b32159b66a450c047285628', '5b32159b66a450fae928562a'],
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.CREATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      relationList: {
        connect: [{ id: '5b32159b66a450c047285628' }, { id: '5b32159b66a450fae928562a' }],
      },
    });
  });

  it('Data with relation list.', () => {
    const data = {
      relationList: [
        {
          scalar: 'Relation List Scalar Value',
          scalarList: ['Relation List Scalar List Value'],
        },
      ],
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.CREATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      relationList: {
        create: [
          {
            scalar: 'Relation List Scalar Value',
            scalarList: ['Relation List Scalar List Value'],
          },
        ],
      },
    });
  });

  it('Data with file list reference.', () => {
    const data = {
      fileList: ['5b32159b66a4500f96285626'],
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.CREATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      fileList: {
        connect: [{ id: '5b32159b66a4500f96285626' }],
      },
    });
  });

  it('Data with list of files null.', () => {
    const fileList = [null];

    const data = {
      fileList,
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.CREATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({});
  });

  it('Data with list of the file objects.', () => {
    const fileList = [
      {
        fileId: 'file-id',
        filename: 'Screenshot at авг. 13 15-22-49.png',
      },
      null,
      null,
    ];

    const data = {
      fileList,
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.CREATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      fileList: {
        create: fileList.slice(0, 1),
      },
    });
  });

  it('Empty address', () => {
    const data = {
      address: {
        street1: '',
        street2: '',
        zip: '',
        city: '',
        state: '',
        country: '',
      },
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.CREATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      address: null,
    });
  });

  it('Empty phone', () => {
    const data = {
      phone: {
        code: '',
        number: '',
      },
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.CREATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      phone: null,
    });
  });

  it('List of phones', () => {
    const data = {
      phones: [
        {
          code: '',
          number: '',
        },
        {
          code: '+78',
          number: '3242342',
        },
      ],
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.CREATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      phones: [data.phones[1]],
    });
  });

  it('List of addresses', () => {
    const data = {
      addresses: [
        {
          street1: '',
          street2: '',
          zip: '',
          city: '',
          state: '',
          country: '',
        },
        {
          street1: 'Pamelia Quall',
          street2: 'Lasonya Friedly',
          zip: 'Timothy Ingleton',
          city: 'Kenia Urhahn',
          state: 'Scottie Swailes',
        },
      ],
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.CREATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      addresses: [data.addresses[1]],
    });
  });

  it('Compelex data.', () => {
    const data = {
      scalar: 'Scalar Value',
      scalarList: ['Scalar List Value'],
      relation: {
        scalar: 'Relation Scalar Value',
      },
      relationList: [
        {
          scalar: 'Relation List Scalar Value',
          scalarList: ['Relation List Scalar List Value'],
          nestedRelation: '5b32159b66a450c047285628',
          nestedRelationList: [
            {
              scalar: 'Relation List Nested Relation List Scalar Value',
              scalarList: ['Relation List Nested Relation List Scalar List Value'],
            },
          ],
        },
      ],
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.CREATE, tableName: 'tableSchema', data, schema: SCHEMA })).toMatchSnapshot();
  });

  it('Data with JSON field', () => {
    const data = {
      json: '{ "somePropArray": ["someValue1", "someValue2", "someValue3"] }',
      jsonList: ['{ "someProp": "someValue" }', '{ "somePropArray": ["someValue1", "someValue2"] }'],
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.CREATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      json: {
        somePropArray: ['someValue1', 'someValue2', 'someValue3'],
      },
      jsonList: [{ someProp: 'someValue' }, { somePropArray: ['someValue1', 'someValue2'] }],
    });
  });

  it('Data with BigInt field', () => {
    const data = {
      bigInt: '999999999999999999999999999999',
      bigIntList: ['999999999999999999999999999999', '111111111111111111111111111111'],
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.CREATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual(data);
  });

  it('should leave non-table fields if option ignoreNonTableFields is false', () => {
    const data = {
      scalar: 'Scalar Value',
      scalarList: ['Scalar List Value'],
      nonTableField: 'Non-table',
    };

    expect(
      formatDataForMutation({ type: MUTATION_TYPE.CREATE, tableName: 'tableSchema', data, schema: SCHEMA, options: { ignoreNonTableFields: false }}),
    ).toEqual(data);
  });

  it('should ignore non-table fields if option ignoreNonTableFields is true', () => {
    const data = {
      scalar: 'Scalar Value',
      scalarList: ['Scalar List Value'],
      nonTableField: 'Non-table',
    };

    const expectedResult = {
      scalar: 'Scalar Value',
      scalarList: ['Scalar List Value'],
    };

    expect(
      formatDataForMutation({ type: MUTATION_TYPE.CREATE, tableName: 'tableSchema', data, schema: SCHEMA, options: { ignoreNonTableFields: true } }),
    ).toEqual(expectedResult);
  });
});

describe('As developer, I can format for update mutation,', () => {
  it('Flat data.', () => {
    const data = {
      scalar: 'Scalar Value',
      scalarList: ['Scalar List Value'],
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.UPDATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual(data);
  });

  it('Data with relation reference.', () => {
    const data = {
      relation: '5b32159b66a4500f96285626',
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.UPDATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      relation: {
        reconnect: { id: '5b32159b66a4500f96285626' },
      },
    });
  });

  it('Data with relation.', () => {
    const data = {
      relation: {
        scalar: 'Relation Scalar Value',
        scalarList: ['Relation Scalar List Value'],
      },
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.UPDATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      relation: {
        create: {
          scalar: 'Relation Scalar Value',
          scalarList: ['Relation Scalar List Value'],
        },
      },
    });
  });

  it('Data with relation with existed id.', () => {
    const data = {
      relation: {
        id: 'id',
        scalar: 'Relation Scalar Value',
        scalarList: ['Relation Scalar List Value'],
      },
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.UPDATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      relation: {
        reconnect: {
          id: 'id',
        },
      },
    });
  });

  it('Data with null relation.', () => {
    const data = {
      relation: null,
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.UPDATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      relation: {
        reconnect: {},
      },
    });
  });

  it('Data with null file.', () => {
    const data = {
      file: null,
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.UPDATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      file: {
        reconnect: {},
      },
    });
  });

  it('Data with file object.', () => {
    const file = {
      fileId: 'file-id',
      filename: 'Screenshot at авг. 13 15-22-49.png',
    };

    const nonFileFields = {
      nonFileField: 'non file field',
    };

    const data = {
      file: { ...file, ...nonFileFields },
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.UPDATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
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

    expect(formatDataForMutation({ type: MUTATION_TYPE.UPDATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      file: {
        reconnect: { id: file.id },
      },
    });
  });

  it('Data with file reference.', () => {
    const data = {
      file: '5b32159b66a4500f96285626',
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.UPDATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      file: {
        reconnect: { id: '5b32159b66a4500f96285626' },
      },
    });
  });

  it('Data with file list reference.', () => {
    const data = {
      fileList: ['5b32159b66a4500f96285626'],
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.UPDATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      fileList: {
        reconnect: [{ id: '5b32159b66a4500f96285626' }],
      },
    });
  });

  it('Data with relation list reference.', () => {
    const data = {
      relationList: ['5b32159b66a450c047285628', '5b32159b66a450fae928562a'],
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.UPDATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      relationList: {
        reconnect: [{ id: '5b32159b66a450c047285628' }, { id: '5b32159b66a450fae928562a' }],
      },
    });
  });

  it('Data with relation list.', () => {
    const data = {
      relationList: [
        {
          scalar: 'Relation List Scalar Value',
          scalarList: ['Relation List Scalar List Value'],
        },
      ],
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.UPDATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      relationList: {
        create: [
          {
            scalar: 'Relation List Scalar Value',
            scalarList: ['Relation List Scalar List Value'],
          },
        ],
        reconnect: [],
      },
    });
  });

  it('Data with null relation list.', () => {
    const data = {
      relationList: null,
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.UPDATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      relationList: {
        reconnect: [],
      },
    });
  });

  it('Data with empty relation list.', () => {
    const data = {
      relationList: [],
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.UPDATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      relationList: {
        reconnect: [],
      },
    });
  });

  it('Data with relation list with existed id.', () => {
    const data = {
      relationList: [
        {
          id: '1',
          scalar: 'Relation List Scalar Value',
          scalarList: ['Relation List Scalar List Value'],
        },
      ],
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.UPDATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      relationList: {
        reconnect: [
          {
            id: data.relationList[0].id,
          },
        ],
      },
    });
  });

  it('Data with list of the file objects.', () => {
    const fileList: [any, null, null] = [
      {
        id: '1234',
        fileId: 'file-id',
        filename: 'Screenshot at авг. 13 15-22-49.png',
      },
      null,
      null,
    ];

    const data = {
      fileList,
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.UPDATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      fileList: {
        reconnect: [
          {
            id: fileList[0].id,
          },
        ],
      },
    });
  });

  it('Empty address', () => {
    const data = {
      address: {
        street1: '',
        street2: '',
        zip: '',
        city: '',
        state: '',
        country: '',
      },
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.UPDATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      address: null,
    });
  });

  it('Empty phone', () => {
    const data = {
      phone: {
        code: '',
        number: '',
      },
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.UPDATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      phone: null,
    });
  });

  it('List of addresses', () => {
    const data = {
      addresses: [
        {
          street1: '',
          street2: '',
          zip: '',
          city: '',
          state: '',
          country: '',
        },
        {
          street1: 'Pamelia Quall',
          street2: 'Lasonya Friedly',
          zip: 'Timothy Ingleton',
          city: 'Kenia Urhahn',
          state: 'Scottie Swailes',
        },
      ],
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.UPDATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      addresses: [data.addresses[1]],
    });
  });

  it('List of phones', () => {
    const data = {
      phones: [
        {
          code: '',
          number: '',
        },
        {
          code: '+89',
          number: '4567823',
        },
      ],
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.UPDATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      phones: [data.phones[1]],
    });
  });

  it('Compelex data.', () => {
    const data = {
      meta: 'meta',
      number: 1,
      numberList: [1, '2', null, ''],
      address: {
        street1: 'Pamelia Quall',
        street2: 'Lasonya Friedly',
        zip: 'Timothy Ingleton',
        city: 'Kenia Urhahn',
        state: 'Scottie Swailes',
      },
      scalar: 'Scalar Value',
      scalarList: ['Scalar List Value'],
      relation: {
        scalar: 'Relation Scalar Value',
      },
      fileList: [
        {
          id: '1234',
          fileId: 'file-id',
          filename: 'Screenshot at авг. 13 15-22-49.png',
          nonFileField: 'non file field',
        },
        null,
        {
          fileId: 'file-id',
          filename: 'Screenshot at авг. 13 15-22-49.png',
          nonFileField: 'non file field',
        },
      ],
      relationList: [
        {
          scalar: 'Relation List Scalar Value',
          scalarList: ['Relation List Scalar List Value'],
          nestedRelation: '5b32159b66a450c047285628',
          nestedRelationList: [
            {
              scalar: 'Relation List Nested Relation List Scalar Value',
              scalarList: ['Relation List Nested Relation List Scalar List Value'],
            },
          ],
        },
      ],
      _description: 'Description',
      __typename: 'Address',
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.UPDATE, tableName: 'tableSchema', data, schema: SCHEMA })).toMatchSnapshot();
  });

  it('Data with JSON field', () => {
    const data = {
      json: '{ "somePropArray": ["someValue1", "someValue2", "someValue3"] }',
      jsonList: ['{ "someProp": "someValue" }', '{ "somePropArray": ["someValue1", "someValue2"] }'],
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.UPDATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual({
      json: {
        somePropArray: ['someValue1', 'someValue2', 'someValue3'],
      },
      jsonList: [{ someProp: 'someValue' }, { somePropArray: ['someValue1', 'someValue2'] }],
    });
  });

  it('Data with BigInt field', () => {
    const data = {
      bigInt: '999999999999999999999999999999',
      bigIntList: ['999999999999999999999999999999', '111111111111111111111111111111'],
    };

    expect(formatDataForMutation({ type: MUTATION_TYPE.UPDATE, tableName: 'tableSchema', data, schema: SCHEMA })).toEqual(data);
  });
});
