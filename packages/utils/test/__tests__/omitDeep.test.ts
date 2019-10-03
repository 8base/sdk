import { omitDeep } from '../../src/formatters/omitDeep';

describe('omitDeep', () => {
  it('should omit properties from the object', () => {
    const sourceObject = {
      prop1: 'prop1',
      prop2: {
        prop2_1: 'prop2_1',
        prop2_2: 'prop2_2',
        __typename: '__typename',
      },
      prop3: ['prop3_3', 'prop3_4'],
      prop4: [
        {
          prop4_1: 'prop4_1',
          __typename: '__typename',
        },
      ],
      __typename: '__typename',
    };

    const resultObject = {
      prop1: 'prop1',
      prop2: {
        prop2_1: 'prop2_1',
        prop2_2: 'prop2_2',
      },
      prop3: ['prop3_3', 'prop3_4'],
      prop4: [
        {
          prop4_1: 'prop4_1',
        },
      ],
    };

    expect(omitDeep(['__typename'], sourceObject)).toEqual(resultObject);
  });

  it('should not transform array to object', () => {
    const value = [['123', 555], { a: 1 }];

    expect(omitDeep(['__typename'], value)).toEqual(value);
  });
});
