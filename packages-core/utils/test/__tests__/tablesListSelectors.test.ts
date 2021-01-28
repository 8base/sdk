import * as selectors from '../../src/selectors/tablesListSelectors';

const tablesSchema: any = [
  {
    id: 'TABLE_ID',
    name: 'TABLE_NAME',
    fields: [
      {
        id: 'f-1',
        name: 'createdAt',
        isMeta: true,
        fieldType: 'RELATION',
      },
      {
        id: 'f-2',
        name: 'some-name',
        isMeta: false,
        fieldType: 'FILE',
      },
    ],
  },
];

it('Should returns table by id', () => {
  expect(selectors.getTableById(tablesSchema, 'TABLE_ID')).toEqual(tablesSchema[0]);
});

it('Should returns undefined for non-existed table id', () => {
  expect(selectors.getTableById(tablesSchema, 'NON_EXISTED_TABLE_ID')).toEqual(undefined);
});

it('Should returns table by name', () => {
  expect(selectors.getTableByName(tablesSchema, 'TABLE_NAME')).toEqual(tablesSchema[0]);
});

it('Should returns undefined for non-existed table name', () => {
  expect(selectors.getTableByName(tablesSchema, 'NON_EXISTED_TABLE_NAME')).toEqual(undefined);
});
