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
      scalarList: ['Scalar List Value'],
      relation: null,
      relationList: {
        items: [
          {
            id: 'id-1',
            scalar: 'Relation List Scalar Value',
            scalarList: ['Relation List Scalar List Value'],
            nestedRelation: {
              id: 'nestedId',
              scalar: 'Nested Scalar Value',
              nonNestedRelationField: 'should be removed',
            },
          },
          {
            id: 'id-2',
            scalar: 'Relation List Scalar Value',
            scalarList: ['Relation List Scalar List Value'],
          },
        ],
      },
      fileList: {
        items: [
          {
            id: 'cjnodqoni000501qnkcga0qra',
            fileId: '9SNTzTfTAWMFarHrohA6',
            filename: '9217163.png',
            downloadUrl:
              'https://cdn.filestackcontent.com/security=p:eyJjYWxsIjpbInJlYWQiXSwiZXhwaXJ5IjoxNTQwNDU5ODAxODYzLCJoYW5kbGUiOiI5U05UelRmVEFXTUZhckhyb2hBNiJ9,s:d019cfe489a72037a9fd57bfc008664b1ec5bd7d4e24f0979aa067d29d54c305/9SNTzTfTAWMFarHrohA6',
            shareUrl:
              'https://prestaging-api.8basedev.com/file/download/cjnod10tj000001pjf7an05k2_Master/cjnodqoni000501qnkcga0qra',
          },
          {
            id: 'cjnodqop0000601qnytfd866c',
            fileId: '5AXQF5SaQRmgrxTJCMqQ',
            filename: '9217163.png',
            downloadUrl:
              'https://cdn.filestackcontent.com/security=p:eyJjYWxsIjpbInJlYWQiXSwiZXhwaXJ5IjoxNTQwNDU5ODAxODYzLCJoYW5kbGUiOiI1QVhRRjVTYVFSbWdyeFRKQ01xUSJ9,s:1ee9fe13f9a855acd1aad3330a7612b4c6849a7de4f9d45d5b831e596ca26115/5AXQF5SaQRmgrxTJCMqQ',
            shareUrl:
              'https://prestaging-api.8basedev.com/file/download/cjnod10tj000001pjf7an05k2_Master/cjnodqop0000601qnytfd866c',
          },
        ],
      },
      json: {
        somePropArray: ['someValue1', 'someValue2', 'someValue3'],
      },
      jsonList: [
        { someProp: 'someValue' },
        {
          somePropArray: ['someValue1', 'someValue2'],
        },
      ],
    };

    expect(formatDataAfterQuery(data, { tableName: 'tableSchema', schema: SCHEMA })).toMatchSnapshot();
  });

  it('Compelex data with formatRelationToIds option.', () => {
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
      scalarList: ['Scalar List Value'],
      relation: null,
      relationList: {
        items: [
          {
            id: 'id-1',
            scalar: 'Relation List Scalar Value',
            scalarList: ['Relation List Scalar List Value'],
            nestedRelation: {
              id: 'nestedId',
              scalar: 'Nested Scalar Value',
              nonNestedRelationField: 'should be removed',
            },
          },
          {
            id: 'id-2',
            scalar: 'Relation List Scalar Value',
            scalarList: ['Relation List Scalar List Value'],
          },
        ],
      },
      fileList: {
        items: [
          {
            id: 'cjnodqoni000501qnkcga0qra',
            fileId: '9SNTzTfTAWMFarHrohA6',
            filename: '9217163.png',
            downloadUrl:
              'https://cdn.filestackcontent.com/security=p:eyJjYWxsIjpbInJlYWQiXSwiZXhwaXJ5IjoxNTQwNDU5ODAxODYzLCJoYW5kbGUiOiI5U05UelRmVEFXTUZhckhyb2hBNiJ9,s:d019cfe489a72037a9fd57bfc008664b1ec5bd7d4e24f0979aa067d29d54c305/9SNTzTfTAWMFarHrohA6',
            shareUrl:
              'https://prestaging-api.8basedev.com/file/download/cjnod10tj000001pjf7an05k2_Master/cjnodqoni000501qnkcga0qra',
          },
          {
            id: 'cjnodqop0000601qnytfd866c',
            fileId: '5AXQF5SaQRmgrxTJCMqQ',
            filename: '9217163.png',
            downloadUrl:
              'https://cdn.filestackcontent.com/security=p:eyJjYWxsIjpbInJlYWQiXSwiZXhwaXJ5IjoxNTQwNDU5ODAxODYzLCJoYW5kbGUiOiI1QVhRRjVTYVFSbWdyeFRKQ01xUSJ9,s:1ee9fe13f9a855acd1aad3330a7612b4c6849a7de4f9d45d5b831e596ca26115/5AXQF5SaQRmgrxTJCMqQ',
            shareUrl:
              'https://prestaging-api.8basedev.com/file/download/cjnod10tj000001pjf7an05k2_Master/cjnodqop0000601qnytfd866c',
          },
        ],
      },
      json: {
        somePropArray: ['someValue1', 'someValue2', 'someValue3'],
      },
      jsonList: [
        { someProp: 'someValue' },
        {
          somePropArray: ['someValue1', 'someValue2'],
        },
      ],
    };

    expect(
      formatDataAfterQuery(
        data,
        {
          tableName: 'tableSchema',
          schema: SCHEMA,
        },
        {
          formatRelationToIds: true,
        },
      ),
    ).toMatchSnapshot();
  });
});
