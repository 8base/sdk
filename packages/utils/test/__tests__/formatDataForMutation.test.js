//@flow

import { formatDataForMutation, MUTATION_TYPE } from '../../src';
import { SCHEMA } from '../__fixtures__';

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

  it('Data with null file.', () => {
    const data = {
      file: null,
    };

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, 'tableSchema', data, SCHEMA)).toEqual({
      file: null,
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

  it('Data with list of files null.', () => {
    const fileList = [null];

    const data = {
      fileList,
    };

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, 'tableSchema', data, SCHEMA)).toEqual({});
  });

  it('Data with list of the file objects.', () => {
    const fileList = [{
      fileId: 'file-id',
      filename: 'Screenshot at авг. 13 15-22-49.png',
    }, null, null];

    const data = {
      fileList,
    };

    expect(formatDataForMutation(MUTATION_TYPE.CREATE, 'tableSchema', data, SCHEMA)).toEqual({
      fileList: {
        create: fileList.slice(0, 1),
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

  it('Data with relation with existed id.', () => {
    const data = {
      relation: {
        id: 'id',
        scalar: 'Relation Scalar Value',
        scalarList: [
          'Relation Scalar List Value',
        ],
      },
    };

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, 'tableSchema', data, SCHEMA)).toEqual({
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

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, 'tableSchema', data, SCHEMA)).toEqual({
      relation: null,
    });
  });

  it('Data with null file.', () => {
    const data = {
      file: null,
    };

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, 'tableSchema', data, SCHEMA)).toEqual({
      file: null,
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
        reconnect: [],
      },
    });
  });

  it('Data with null relation list.', () => {
    const data = {
      relationList: null,
    };

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, 'tableSchema', data, SCHEMA)).toEqual({
      relationList: {
        reconnect: [],
      },
    });
  });

  it('Data with empty relation list.', () => {
    const data = {
      relationList: [],
    };

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, 'tableSchema', data, SCHEMA)).toEqual({
      relationList: {
        reconnect: [],
      },
    });
  });

  it('Data with relation list with existed id.', () => {
    const data = {
      relationList: [{
        id: '1',
        scalar: 'Relation List Scalar Value',
        scalarList: [
          'Relation List Scalar List Value',
        ],
      }],
    };

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, 'tableSchema', data, SCHEMA)).toEqual({
      relationList: {
        reconnect: [{
          id: data.relationList[0].id,
        }],
      },
    });
  });

  it('Data with list of the file objects.', () => {
    const fileList = [{
      id: '1234',
      fileId: 'file-id',
      filename: 'Screenshot at авг. 13 15-22-49.png',
    }, null, null];

    const data = {
      fileList,
    };

    expect(formatDataForMutation(MUTATION_TYPE.UPDATE, 'tableSchema', data, SCHEMA)).toEqual({
      fileList: {
        reconnect: [{
          id: fileList[0].id,
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
      fileList: [{
        id: '1234',
        fileId: 'file-id',
        filename: 'Screenshot at авг. 13 15-22-49.png',
      }, null, {
        fileId: 'file-id',
        filename: 'Screenshot at авг. 13 15-22-49.png',
      }],
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
