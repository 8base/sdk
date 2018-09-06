// @flow
import * as R from 'ramda';
import {
  createQueryString, createTableFilterGraphqlTag,
  createTableRowCreateTag, createTableRowDeleteTag,
} from '../../src/queryTableGenerator';

const removeEmptySymbols = R.pipe(
  R.replace(/\s\s/g, ''),
  R.replace(/\n/g, ' '),
  R.replace(/\{\s/g, '{'),
  R.replace(/\s\}/g, '}'),
);

describe('helpers for the table query generator', () => {
  it('should transform fields list to the string', () => {
    expect(removeEmptySymbols(
      createQueryString(
        {
          name: 'table',
          fields: [
            { name: 'field1', id: '1' },
            { name: 'field2', id: '2' },
            { name: 'field3', id: '3' },
          ],
        })),
    ).toEqual(removeEmptySymbols(
      `field1
      field2
      field3
    `));
  });

  it('should transform fieldslist to the string with relation fields', () => {
    expect(removeEmptySymbols(
      createQueryString({
        name: 'table',
        fields: [
          { name: 'field1', id: '1', fieldType: 'RELATION' },
          { name: 'field2', id: '2' },
          { name: 'field3', id: '3' },
        ],
      })),
    ).toEqual(removeEmptySymbols(
      `field1 { id _description }
      field2
      field3
    `));
  });

  it('should generate graphql tag for the table content ', () => {
    expect(removeEmptySymbols(
      createTableFilterGraphqlTag(
        {
          name: 'someTable',
          fields: [{ name: 'field1', id: '1' }, { name: 'field2', id: '2' }, { name: 'field3', id: '3' }],
        },
      )),
    ).toEqual(removeEmptySymbols(`
      query DataViewerTableSomeTableContent($filter: SomeTableFilter, $orderBy: [SomeTableOrderBy], $after: String, $before: String, $first: Int, $last: Int, $skip: Int) {
        tableContent: someTablesList(filter: $filter, orderBy: $orderBy, after: $after, before: $before, first: $first, last: $last, skip: $skip) {
          field1
          field2
          field3
          _description
          id
        }
      }`,
    ));
  });

  it('should generate graphql tag for the table in PascalCase ', () => {
    expect(removeEmptySymbols(createTableFilterGraphqlTag({ name: 'PascalTable' })),
    ).toEqual(removeEmptySymbols(`
      query DataViewerTablePascalTableContent($filter: PascalTableFilter, $orderBy: [PascalTableOrderBy], $after: String, $before: String, $first: Int, $last: Int, $skip: Int) {
        tableContent: pascalTablesList(filter: $filter, orderBy: $orderBy, after: $after, before: $before, first: $first, last: $last, skip: $skip) {
          _description
          id
        }
      }`,
    ));
  });

  it('should generate tag for the delete mutation', () => {
    expect(removeEmptySymbols(createTableRowDeleteTag({ name: 'PascalTable' })))
      .toEqual(removeEmptySymbols(`
        mutation DataViewerPascalTableRowDelete($data: PascalTableDeleteInput) {
          pascalTableDelete(data: $data) {
            success
          }
        }`,
      ));
  });

  it('should generate tag for the create mutation', () => {
    expect(removeEmptySymbols(createTableRowCreateTag({
      name: 'PascalTable',
      fields: [{ name: 'field1', id: '1' }, { name: 'field2', id: '2' }, { name: 'field3', id: '3' }],
    })))
      .toEqual(removeEmptySymbols(`
        mutation DataViewerPascalTableRowCreate($data: PascalTableCreateInput) {
          pascalTableCreate(data: $data) {
            field1
            field2
            field3
            id
          }
        }`,
      ));
  });
});
