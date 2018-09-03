// @flow

import * as selectors from '../../src/tablesListSelectors';

const tablesListState = [
  {
    id: 't-1',
    name: 'pit12',
  },
  {
    id: 't-2',
    name: 'pit13',
  },
];


describe('apollo tablesList selectors', () => {
  it('should return table name by table id', () => {
    expect(selectors.getTableById(tablesListState, 't-1').name).toEqual('pit12');
    expect(selectors.getTableById(tablesListState, 't-2').name).toEqual('pit13');
  });

  it('should return table id by table name', () => {
    expect(selectors.getTableByName(tablesListState, 'pit12').id).toEqual('t-1');
    expect(selectors.getTableByName(tablesListState, 'pit13').id).toEqual('t-2');
  });

  it('should return undefined if table not foud', () => {
    expect(selectors.getTableByName(tablesListState, 'unexist')).toBeUndefined();
    expect(selectors.getTableById(tablesListState, 'unexist')).toBeUndefined();
  });
});
