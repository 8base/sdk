import { throwIfMissingRequiredParameters, SDKError, ERROR_CODES } from '../../src';

describe('throwIfMissingRequiredOption', () => {
  const testFunction = (parameters) => {
    throwIfMissingRequiredParameters(
      [
        'key2',
        ['key1', 'nestedKey1'],
      ],
      '@8base/test',
      parameters,
    );
  };

  it('throws if there is a missing option', () => {
    expect(() => {
      testFunction({
        key1: {
          nestedKey1: 'someValue',
        },
        key3: 'someValue',
      });
    }).toThrow(new SDKError(
      ERROR_CODES.MISSING_PARAMETER,
      '@8base/test',
      'Missing parameter: key2',
    ));
  });

  it('throws if there is a missing option: nested check', () => {
    expect(() => {
      testFunction({
        key2: 'someValue',
        key3: 'someValue',
      });
    }).toThrow(new SDKError(
      ERROR_CODES.MISSING_PARAMETER,
      '@8base/test',
      'Missing parameter: key1.nestedKey1',
    ));
  });

  it('doesn\'t throw if there isn\'t a missing option', () => {
    expect(() => {
      testFunction({
        key1: {
          nestedKey1: 'someValue',
        },
        key2: 'someValue',
        key3: 'someValue',
      });
    }).not.toThrow();
  });
});

