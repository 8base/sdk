//@flow

import { formatDataAfterQuery } from '../../src';
import { SCHEMA } from '../__fixtures__';

describe('As developer, I can format for create mutation,', () => {
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
      relationList: {
        items: [{
          scalar: 'Relation List Scalar Value',
          scalarList: [
            'Relation List Scalar List Value',
          ],
          nestedRelation: '5b32159b66a450c047285628',
        }],
      },
    };

    expect(formatDataAfterQuery('tableSchema', data, SCHEMA)).toMatchSnapshot();
  });
});
