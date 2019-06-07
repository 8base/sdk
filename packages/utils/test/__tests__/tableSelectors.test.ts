import * as selectors from '../../src/selectors/tableSelectors';

const tableState: any = {
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

  it('should return true when table has list fields', () => {
    expect(selectors.hasListFields(tableState)).toBeFalsy();

    expect(selectors.hasListFields({
      ...tableState,
      fields: [
        ...tableState.fields,
        {
          id: 'f-1',
          name: 'createdAt',
          isMeta: true,
          fieldType: 'RELATION',
          isList: true,
        },
      ],
    })).toBeTruthy();
  });

  it('should return true when table has relation fields', () => {
    expect(selectors.hasRelationFields(tableState)).toBeTruthy();

    expect(selectors.hasRelationFields({
      ...tableState,
      fields: [
        {
          name: 'createdAt',
          isMeta: true,
          fieldType: 'TEXT',
        },
      ],
    })).toBeFalsy();
  });

  it('should return true when table has address fields', () => {
    expect(selectors.hasAddressFields(tableState)).toBeFalsy();

    expect(selectors.hasAddressFields({
      ...tableState,
      fields: [
        ...tableState.fields,
        {
          name: 'createdAt',
          isMeta: true,
          fieldType: 'SMART',
          fieldTypeAttributes: {
            format: 'ADDRESS',
          },
        },
      ],
    })).toBeTruthy();
  });

  it('should return true when table has phone fields', () => {
    expect(selectors.hasPhoneFields(tableState)).toBeFalsy();

    expect(selectors.hasPhoneFields({
      ...tableState,
      fields: [
        ...tableState.fields,
        {
          name: 'createdAt',
          isMeta: true,
          fieldType: 'SMART',
          fieldTypeAttributes: {
            format: 'PHONE',
          },
        },
      ],
    })).toBeTruthy();
  });
});
