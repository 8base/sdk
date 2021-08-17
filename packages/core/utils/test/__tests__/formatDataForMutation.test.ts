import * as R from 'ramda';

import { formatDataForMutation, MUTATION_TYPE } from '../../src';
import { SCHEMA } from '../__fixtures__';

describe('As developer, I can format for create mutation,', () => {
  it('Untouchabled data.', () => {
    const data = {
      untouchable: 10,
    };

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({});
  });

  it('Flat data.', () => {
    const data = {
      scalar: 'Scalar Value',
      scalarList: ['Scalar List Value'],
    };

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual(
      data,
    );
  });

  it('Data with empty number.', () => {
    const data = {
      number: '',
    };

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
      number: null,
    });
  });

  it('Data with empty numbers.', () => {
    const data = {
      numberList: ['', null],
    };

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
      numberList: [],
    });
  });

  it('Data with relation reference.', () => {
    const data = {
      relation: '5b32159b66a4500f96285626',
    };

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
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

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
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

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
      relation: null,
    });
  });

  it('Data with null file.', () => {
    const data = {
      file: null,
    };

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
      file: null,
    });
  });

  it('Data with file reference.', () => {
    const data = {
      file: '5b32159b66a4500f96285626',
    };

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
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

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
      file: {
        create: file,
      },
    });
  });

  it('Data with relation list reference.', () => {
    const data = {
      relationList: ['5b32159b66a450c047285628', '5b32159b66a450fae928562a'],
    };

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
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

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
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

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
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

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({});
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

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
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

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
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

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
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

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
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

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
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

    expect(
      formatDataForMutation(MUTATION_TYPE.CREATE, data, { tableName: 'tableSchema', schema: SCHEMA }),
    ).toMatchSnapshot();
  });

  it('Data with JSON field', () => {
    const data = {
      json: '{ "somePropArray": ["someValue1", "someValue2", "someValue3"] }',
      jsonList: ['{ "someProp": "someValue" }', '{ "somePropArray": ["someValue1", "someValue2"] }'],
    };

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
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

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual(
      data,
    );
  });

  it('Data with empty BigInt fields', () => {
    const data = {
      bigInt: '',
      bigIntList: ['999999999999999999999999999999', '', '111111111111111111111111111111'],
    };

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
      bigInt: null,
      bigIntList: ['999999999999999999999999999999', '111111111111111111111111111111'],
    });
  });

  it('should leave non-table fields if option ignoreNonTableFields is false', () => {
    const data = {
      scalar: 'Scalar Value',
      scalarList: ['Scalar List Value'],
      nonTableField: 'Non-table',
    };

    expect(
      formatDataForMutation(
        MUTATION_TYPE.CREATE,
        data,
        {
          tableName: 'tableSchema',
          schema: SCHEMA,
        },
        { ignoreNonTableFields: false },
      ),
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
      formatDataForMutation(
        MUTATION_TYPE.CREATE,
        data,
        {
          tableName: 'tableSchema',
          schema: SCHEMA,
        },
        { ignoreNonTableFields: true },
      ),
    ).toEqual(expectedResult);
  });
});

describe('As developer, I can format for update mutation,', () => {
  it('Untouchabled data.', () => {
    const data = {
      untouchable: 10,
    };

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({});
  });

  it('Flat data.', () => {
    const data = {
      scalar: 'Scalar Value',
      scalarList: ['Scalar List Value'],
    };

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual(
      data,
    );
  });

  it('Data with relation reference.', () => {
    const data = {
      relation: '5b32159b66a4500f96285626',
    };

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
      relation: {
        connect: { id: '5b32159b66a4500f96285626' },
      },
    });
  });

  it('Data with removed relation reference.', () => {
    const initialData = {
      relation: '5b32159b66a4500f96285626',
    };

    const data = {
      relation: undefined,
    };

    expect(
      formatDataForMutation(MUTATION_TYPE.UPDATE, data, { tableName: 'tableSchema', schema: SCHEMA, initialData }),
    ).toEqual({
      relation: {
        disconnect: { id: '5b32159b66a4500f96285626' },
      },
    });
  });

  it('Data with removed scalar value', () => {
    const initialData = {
      scalar: 'Scalar Value',
    };

    // Without initial data
    expect(
      formatDataForMutation(MUTATION_TYPE.UPDATE, { scalar: undefined }, { tableName: 'tableSchema', schema: SCHEMA }),
    ).toEqual({
      scalar: undefined,
    });

    // With initial data and scalar is undefined
    expect(
      formatDataForMutation(
        MUTATION_TYPE.UPDATE,
        { scalar: undefined },
        { tableName: 'tableSchema', schema: SCHEMA, initialData },
      ),
    ).toEqual({
      scalar: null,
    });

    expect(
      formatDataForMutation(MUTATION_TYPE.UPDATE, {}, { tableName: 'tableSchema', schema: SCHEMA, initialData }),
    ).toEqual({
      scalar: null,
    });

    // With initial data and scalar is null
    expect(
      formatDataForMutation(
        MUTATION_TYPE.UPDATE,
        { scalar: null },
        { tableName: 'tableSchema', schema: SCHEMA, initialData },
      ),
    ).toEqual({
      scalar: null,
    });

    // With initial data and scalar is empty string
    expect(
      formatDataForMutation(
        MUTATION_TYPE.UPDATE,
        { scalar: '' },
        { tableName: 'tableSchema', schema: SCHEMA, initialData },
      ),
    ).toEqual({
      scalar: '',
    });

    // With initial data and scalar is false
    expect(
      formatDataForMutation(
        MUTATION_TYPE.UPDATE,
        { scalar: false },
        { tableName: 'tableSchema', schema: SCHEMA, initialData },
      ),
    ).toEqual({
      scalar: false,
    });

    // With initial data and scalar is zero
    expect(
      formatDataForMutation(
        MUTATION_TYPE.UPDATE,
        { scalar: 0 },
        { tableName: 'tableSchema', schema: SCHEMA, initialData },
      ),
    ).toEqual({
      scalar: 0,
    });
  });

  it('Data with removed scalar value in nested structure', () => {
    const initialData = {
      relation: {
        id: 'relation-1',
        scalar: 'Scalar Value',
      },
    };

    const data = {
      relation: {
        id: 'relation-1',
      },
    };

    expect(
      formatDataForMutation(MUTATION_TYPE.UPDATE, data, { tableName: 'tableSchema', schema: SCHEMA, initialData }),
    ).toEqual({
      relation: {
        update: {
          scalar: null,
        },
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

    const initialData = {
      relation: {
        id: 'removed-relation-1',
      },
    };

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
      relation: {
        create: {
          scalar: 'Relation Scalar Value',
          scalarList: ['Relation Scalar List Value'],
        },
      },
    });

    expect(
      formatDataForMutation(MUTATION_TYPE.UPDATE, data, { tableName: 'tableSchema', schema: SCHEMA, initialData }),
    ).toEqual({
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
        scalar: 'New Relation Scalar Value',
        scalarList: ['Relation Scalar List Value'],
      },
    };

    const initialData = {
      relation: {
        id: 'removed-relation-1',
        scalar: 'Relation Scalar Value',
        scalarList: ['Relation Scalar List Value'],
      },
    };

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
      relation: {
        update: R.dissoc('id', data.relation),
      },
    });

    // TODO: For now, it will update despite ids are different in `data` and `initialData`.
    // We probably should connect instead of update in that case.
    expect(
      formatDataForMutation(MUTATION_TYPE.UPDATE, data, { tableName: 'tableSchema', schema: SCHEMA, initialData }),
    ).toEqual({
      relation: {
        update: {
          scalar: data.relation.scalar,
        },
      },
    });
  });

  it('Data with null relation.', () => {
    const data = {
      relation: null,
    };

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
      relation: null,
    });
  });

  it('Data with null file.', () => {
    const data = {
      file: null,
    };

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
      file: null,
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

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
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
      downloadUrl: 'downloadUrl',
    };

    const data = {
      file,
    };

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
      file: {
        update: R.omit(['id', 'downloadUrl'], file),
      },
    });
  });

  it('Data with file reference.', () => {
    const data = {
      file: '5b32159b66a4500f96285626',
    };

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
      file: {
        connect: { id: '5b32159b66a4500f96285626' },
      },
    });
  });

  it('Data with file list reference.', () => {
    const data = {
      fileList: ['5b32159b66a4500f96285626'],
    };

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
      fileList: {
        connect: [{ id: '5b32159b66a4500f96285626' }],
      },
    });
  });

  it('Data with relation list reference.', () => {
    const data = {
      relationList: ['5b32159b66a450c047285628', '5b32159b66a450fae928562a'],
    };

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
      relationList: {
        connect: [{ id: '5b32159b66a450c047285628' }, { id: '5b32159b66a450fae928562a' }],
      },
    });
  });

  it('Data with removed relation list reference.', () => {
    const initialData = {
      relationList: ['5b32159b66a450c047285628', '5b32159b66a450fae928562a'],
    };

    const data = {
      relationList: ['5b32159b66a450c047285628'],
    };

    expect(
      formatDataForMutation(MUTATION_TYPE.UPDATE, data, { tableName: 'tableSchema', schema: SCHEMA, initialData }),
    ).toEqual({
      relationList: {
        disconnect: [{ id: '5b32159b66a450fae928562a' }],
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

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
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

  it('Data with new and existing relations.', () => {
    const data = {
      relationList: [
        'inline-relation-01',
        {
          id: 'update-relation-01',
          scalar: 'New Update relation scalar value',
          scalarList: ['Update relation scalar list value', 'New Update relation scalar list value'],
        },
        {
          scalar: 'New relation scalar value',
          scalarList: ['New relation scalar list value'],
        },
        {
          id: 'connect-relation-01',
        },
      ],
    };

    const initialData = {
      relationList: [
        {
          id: 'update-relation-01',
          scalar: 'Update relation scalar value',
          scalarList: ['Update relation scalar list value'],
        },
        {
          id: 'removed-relation-01',
          scalar: 'Removed relation scalar value',
          scalarList: ['Removed relation scalar list value'],
        },
      ],
    };

    const expectedRelationListWithoutDisconnectWithInitial = {
      connect: [
        {
          id: 'inline-relation-01',
        },
      ],
      update: [
        {
          data: {
            scalar: 'New Update relation scalar value',
            scalarList: ['Update relation scalar list value', 'New Update relation scalar list value'],
          },
          filter: {
            id: 'update-relation-01',
          },
        },
        // TODO: For now, it will update despite there no such id in `initialData`.
        // We probably should connect instead of update in that case.
        {
          data: {
            id: 'connect-relation-01',
          },
          filter: {
            id: 'connect-relation-01',
          },
        },
      ],
      create: [
        {
          scalar: 'New relation scalar value',
          scalarList: ['New relation scalar list value'],
        },
      ],
    };

    const expectedRelationListWithoutDisconnect = {
      connect: [
        {
          id: 'inline-relation-01',
        },
      ],
      update: [
        {
          data: {
            id: 'update-relation-01',
            scalar: 'New Update relation scalar value',
            scalarList: ['Update relation scalar list value', 'New Update relation scalar list value'],
          },
          filter: {
            id: 'update-relation-01',
          },
        },
        // TODO: For now, it will update despite there no such id in `initialData`.
        // We probably should connect instead of update in that case.
        {
          data: {
            id: 'connect-relation-01',
          },
          filter: {
            id: 'connect-relation-01',
          },
        },
      ],
      create: [
        {
          scalar: 'New relation scalar value',
          scalarList: ['New relation scalar list value'],
        },
      ],
    };

    expect(
      formatDataForMutation(MUTATION_TYPE.UPDATE, data, {
        tableName: 'tableSchema',
        schema: SCHEMA,
        initialData,
      }),
    ).toEqual({
      relationList: {
        ...expectedRelationListWithoutDisconnectWithInitial,
        disconnect: [{ id: 'removed-relation-01' }],
      },
    });

    expect(
      formatDataForMutation(MUTATION_TYPE.UPDATE, data, {
        tableName: 'tableSchema',
        schema: SCHEMA,
      }),
    ).toEqual({
      relationList: expectedRelationListWithoutDisconnect,
    });
  });

  it('Data with null relation list.', () => {
    const data = {
      relationList: null,
    };

    expect(
      formatDataForMutation(MUTATION_TYPE.UPDATE, data, {
        tableName: 'tableSchema',
        schema: SCHEMA,
      }),
    ).toEqual({
      relationList: {},
    });
  });

  it('Data with empty relation list.', () => {
    const data = {
      relationList: [],
    };

    expect(
      formatDataForMutation(MUTATION_TYPE.UPDATE, data, {
        tableName: 'tableSchema',
        schema: SCHEMA,
      }),
    ).toEqual({
      relationList: {},
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

    const expectedUpdateData = data.relationList.map((item) => ({ data: item, filter: { id: item.id } }));

    expect(
      formatDataForMutation(MUTATION_TYPE.UPDATE, data, {
        tableName: 'tableSchema',
        schema: SCHEMA,
      }),
    ).toEqual({
      relationList: {
        update: expectedUpdateData,
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

    expect(
      formatDataForMutation(MUTATION_TYPE.UPDATE, data, {
        tableName: 'tableSchema',
        schema: SCHEMA,
      }),
    ).toEqual({
      fileList: {
        update: [{ data: fileList[0], filter: { id: fileList[0].id } }],
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

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
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

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
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

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
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

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
      phones: [data.phones[1]],
    });
  });

  it('Compelex data.', () => {
    const initialData = {
      meta: 'initial meta',
      number: 0,
      numberList: [],
      address: {
        street1: 'Initial Pamelia Quall',
        street2: 'Initial Lasonya Friedly',
        zip: 'Initial Timothy Ingleton',
        city: 'Initial Kenia Urhahn',
        state: 'Initial Scottie Swailes',
      },
      scalar: 'Removed Scalar Value',
      scalarList: ['Removed Scalar Value', 'Scalar List Value'],
      relation: {
        id: 'relation-1',
        scalar: 'Removed Relation Scalar Value',
      },
      fileList: [
        {
          id: '1234',
          fileId: 'file-id',
          filename: 'Initial Screenshot at авг. 13 15-22-49.png',
          nonFileField: 'non file field',
        },
        {
          id: 'removed-file-1',
          fileId: 'file-id',
          filename: 'Initial Screenshot at авг. 13 15-22-49.png',
        },
      ],
      relationList: [
        {
          id: 'relation-list-1',
          scalar: 'Removed Relation List Scalar Value',
          scalarList: ['Initial Relation List Scalar List Value'],
        },
        {
          id: 'relation-list-2',
          scalar: 'Initial Relation List Scalar Value',
          scalarList: ['Initial Relation List Scalar List Value'],
          nestedRelation: {
            id: 'nested-relation-2-1',
            scalar: 'Removed Nested Relation Scalar Value',
          },
          nestedRelationList: [
            {
              id: 'nested-relation-2-2',
              scalar: 'Initial Relation List Nested Relation List Scalar Value',
              scalarList: ['Initial Relation List Nested Relation List Scalar List Value'],
            },
          ],
        },
        {
          id: 'removed-relation-list-1',
          scalar: 'Initial Relation List Scalar Value',
          scalarList: ['Initial Relation List Scalar List Value'],
        },
      ],
      _description: 'Description',
      __typename: 'Address',
    };

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
      scalarList: ['Scalar List Value'],
      relation: {
        id: 'relation-1',
        scalar: undefined,
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
          id: 'connect-relation-list-1',
        },
        {
          id: 'relation-list-1',
          scalar: null,
          scalarList: ['Update Relation List Scalar List Value'],
          nestedRelation: {
            scalar: 'New Nested Relation Scalar Value',
          },
          nestedRelationList: [
            {
              scalar: 'Relation List Nested Relation List Scalar Value',
              scalarList: ['Relation List Nested Relation List Scalar List Value'],
            },
          ],
        },
        {
          id: 'relation-list-2',
          scalar: 'Update Relation List Scalar Value',
          scalarList: ['Update Relation List Scalar List Value'],
          nestedRelation: {
            id: 'nested-relation-2-1',
            scalar: null,
          },
          nestedRelationList: [
            {
              id: 'nested-relation-2-2',
              scalar: 'Relation List Nested Relation List Scalar Value',
              scalarList: ['Relation List Nested Relation List Scalar List Value'],
            },
          ],
        },
        {
          scalar: 'Relation List Scalar Value',
          scalarList: ['Relation List Scalar List Value'],
          nestedRelation: '5b32159b66a450c047285628',
          nestedRelationList: [
            {
              id: 'nested-relation-id',
              scalar: 'Relation List Nested Relation List Scalar Value',
              scalarList: ['Relation List Nested Relation List Scalar List Value'],
            },
            {
              scalar: 'New Relation List Nested Relation List Scalar Value',
              scalarList: ['New Relation List Nested Relation List Scalar List Value'],
            },
          ],
        },
      ],
      _description: 'Description',
      __typename: 'Address',
    };

    expect(
      formatDataForMutation(MUTATION_TYPE.UPDATE, data, {
        tableName: 'tableSchema',
        schema: SCHEMA,
        initialData,
      }),
    ).toMatchSnapshot();

    expect(
      formatDataForMutation(MUTATION_TYPE.UPDATE, data, {
        tableName: 'tableSchema',
        schema: SCHEMA,
      }),
    ).toMatchSnapshot();
  });

  it('Data with JSON field', () => {
    const data = {
      json: '{ "somePropArray": ["someValue1", "someValue2", "someValue3"] }',
      jsonList: ['{ "someProp": "someValue" }', '{ "somePropArray": ["someValue1", "someValue2"] }'],
    };

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual({
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

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, data, { tableName: 'tableSchema', schema: SCHEMA })).toEqual(
      data,
    );
  });
});
