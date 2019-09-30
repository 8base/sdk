import * as utilsExport from '@8base/utils';
import * as validateExport from '@8base/validate';
import * as authExport from '@8base/auth';
import * as apolloLinksExport from '@8base/apollo-links';
import * as apolloClientExport from '@8base/apollo-client';

describe('8base-sdk', () => {
  const rootExport = require('../../src');

  it('contains @8base/utils', () => {
    expect(rootExport).toMatchObject(utilsExport);
  });

  it('contains @8base/validate', () => {
    expect(rootExport).toMatchObject(validateExport);
  });

  it('contains @8base/auth', () => {
    expect(rootExport).toMatchObject(authExport);
  });

  it('contains @8base/apollo-links', () => {
    expect(rootExport).toMatchObject(apolloLinksExport);
  });

  it('contains @8base/apollo-client', () => {
    expect(rootExport).toMatchObject(apolloClientExport);
  });
});
