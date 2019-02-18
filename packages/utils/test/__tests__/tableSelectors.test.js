// @flow
import * as selectors from '../../src/selectors/tableSelectors';

const tableState = {
  id: 't-1',
  name: 'pit12',
  fields: [{
    id: 'f-1',
    name: 'createdAt',
    isMeta: true,
    fieldType: 'RELATION',
  }, {
    id: 'f-2',
    name: 'some-name',
    isMeta: false,
    fieldType: 'FILE',
  }],
};


describe('apollo table selectors', () => {
  it('should return current table', () => {
    expect(selectors.getTable(tableState)).toEqual(tableState);
  });

  it('should return field by id', () => {
    expect(selectors.getFieldById(tableState, 'f-2')).toEqual(tableState.fields[1]);
  });

  it('should return field name by id', () => {
    expect(selectors.getFieldNameById(tableState, 'f-2')).toBe('some-name');
  });

  it('should return true when field is meta', () => {
    expect(selectors.isMetaField(tableState, 'f-1')).toBeTruthy();
    expect(selectors.isMetaField(tableState, 'f-2')).toBeFalsy();
  });

  it('should return right types', () => {
    expect(selectors.isFileField(tableState, 'f-1')).toBeFalsy();
    expect(selectors.isFileField(tableState, 'f-2')).toBeTruthy();

    expect(selectors.isRelationField(tableState, 'f-1')).toBeTruthy();
    expect(selectors.isRelationField(tableState, 'f-2')).toBeFalsy();
  });
});
