import { Injectable } from "@angular/core";

/**
 * This service is responsible for providing Storage implementations.
 */
@Injectable()
export class StorageService {

  /**
   * Retrieve the specified Storage.
   *
   * @param type        The storage type
   * @returns {Storage} A storage implementation
   */
  getStorage(type: StorageType): SBStorage {
    switch (type) {
      case StorageType.Session:
        return sessionStorage;
      case StorageType.Local:
        return localStorage;
      default:
        console.log(`Unknown StorageType: ${type}`);
    }
  }
}

/**
 * Storage types.  Local persists indefinitely, Session persists for the length of the browser.
 */
export enum StorageType {
  Session,  //Persists for the lifetime of the browser tab
  Local     //Persists indefinitely
}

/**
 * This interface is a sub-set of the Storage interface with the
 * index-aware methods and properties removed.
 */
export interface SBStorage {
  getItem(key: string): string | null;
  removeItem(key: string): void;
  setItem(key: string, data: string): void;
}
