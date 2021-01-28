import * as appProviderExport from '@8base-react/app-provider';
import * as fileInputExport from '@8base-react/file-input';
import * as crudExport from '@8base-react/crud';
import * as formsExport from '@8base-react/forms';
import * as permissionsProviderExport from '@8base-react/permissions-provider';
import * as authExport from '@8base-react/auth';
import * as tableSchemaProviderExport from '@8base-react/table-schema-provider';
import * as utilsExport from '@8base-react/utils';

describe('8base-react-sdk', () => {
  const rootExport = require('../../src');

  it('contains @8base-react/app-provider', () => {
    expect(rootExport).toMatchObject(appProviderExport);
  });

  it('contains @8base-react/file-input', () => {
    expect(rootExport).toMatchObject(fileInputExport);
  });

  it('contains @8base-react/crud', () => {
    expect(rootExport).toMatchObject(crudExport);
  });

  it('contains @8base-react/forms', () => {
    expect(rootExport).toMatchObject(formsExport);
  });

  it('contains @8base-react/permissions-provider', () => {
    expect(rootExport).toMatchObject(permissionsProviderExport);
  });

  it('contains @8base-react/auth', () => {
    expect(rootExport).toMatchObject(authExport);
  });

  it('contains @8base-react/table-schema-provider', () => {
    expect(rootExport).toMatchObject(tableSchemaProviderExport);
  });

  it('contains @8base-react/utils', () => {
    expect(rootExport).toMatchObject(utilsExport);
  });
});
