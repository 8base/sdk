import { throwIfMissing, throwIfMissingRequiredOption } from '../../src';

describe('throwIfMissing', () => {
  const testFunction: (arg: string | void) => string | void = (someParam = throwIfMissing('someParam')) => { return someParam; };

  it('throws if there is a missing function parameter', () => {
    expect(() => {
      testFunction();
    }).toThrow('Missing parameter: someParam');
  });

  it('doesn\'t throw if there isn\'t a missing function parameter', () => {
    expect(() => {
      testFunction('test');
    }).not.toThrow();
  });
});

describe('throwIfMissingRequiredOption', () => {
  const testFunction = (options: any) => {
    throwIfMissingRequiredOption([
      'key2',
      ['key1', 'nestedKey1'],
    ], options);
  };

  it('throws if there is a missing option', () => {
    expect(() => {
      testFunction({
        key1: {
          nestedKey1: 'someValue',
        },
        key3: 'someValue',
      });
    }).toThrow('Missing option: key2');
  });

  it('throws if there is a missing option: nested check', () => {
    expect(() => {
      testFunction({
        key2: 'someValue',
        key3: 'someValue',
      });
    }).toThrow('Missing option: key1.nestedKey1');
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

