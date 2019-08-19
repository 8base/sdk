import { IStorage } from './types';

export class StorageAPI<T> {
  private storage: IStorage;
  private storageKey: string;

  constructor(storage: IStorage, storageKey: string) {
    this.storage = storage;
    this.storageKey = storageKey;
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
