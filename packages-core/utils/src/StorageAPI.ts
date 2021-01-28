import { IStorage, IStorageAPI } from './types';

export class StorageAPI<T> implements IStorageAPI<T> {
  private storage: IStorage;
  private readonly storageKey: string;

  constructor(storage: IStorage, storageKey: string, initialState?: T) {
    this.storage = storage;
    this.storageKey = storageKey;

    if (!!initialState) {
      this.setState(initialState);
    }
  }

  public getState(): T {
    const auth = JSON.parse(this.storage.getItem(this.storageKey) || '{}');

    return auth || {};
  }

  public setState(newState: T): void {
    const currentState = this.getState();
    const mergedState = {
      ...currentState,
      ...newState,
    };

    this.storage.setItem(this.storageKey, JSON.stringify(mergedState));
  }

  public purgeState(): void {
    this.storage.removeItem(this.storageKey);
  }
}
