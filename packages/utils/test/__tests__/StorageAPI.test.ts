import { StorageAPI } from '../../src/StorageAPI';

const STORAGE_KEY = 'test';

const storageObj = {};

const storage = {
  getItem: jest.fn((key: string) => Reflect.get(storageObj, key)),
  setItem: jest.fn((key: string, value: string) => {
    Reflect.set(storageObj, key, value);
  }),
  removeItem: jest.fn((key: string) => {
    Reflect.deleteProperty(storageObj, key);
  }),
};

describe('StorageAPI', () => {
  const storageAPI = new StorageAPI(storage, STORAGE_KEY);

  it('As a developer, I can getstate', () => {
    const state = storageAPI.getState();

    expect(state).toEqual({});
  });

  it('As a developer, I can set state', () => {
    storageAPI.setState({
      someKey: 'someValue',
    });

    expect(storageAPI.getState()).toEqual({
      someKey: 'someValue',
    });
  });

  it('As a developer, I can supplement state', () => {
    storageAPI.setState({
      someAnotherKey: 'someAnotherValue',
    });

    expect(storageAPI.getState()).toEqual({
      someKey: 'someValue',
      someAnotherKey: 'someAnotherValue',
    });
  });

  it('As a develiper, I can rewrite state', () => {
    storageAPI.setState({
      someKey: 'theValue',
      yetAnotherKey: 'yetAnotherValue',
    });

    expect(storageAPI.getState()).toEqual({
      someKey: 'theValue',
      someAnotherKey: 'someAnotherValue',
      yetAnotherKey: 'yetAnotherValue',
    });
  });

  it('As a developer, I can purge state', () => {
    storageAPI.purgeState();

    expect(storageAPI.getState()).toEqual({});
  });
});
