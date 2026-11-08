import { Injectable } from '@angular/core';

/**
 * Modern browser storage service leveraging standardized `navigator.storage`.
 * Replaces deprecated legacy APIs (such as StorageType.persistent / webkitPersistentStorage)
 * with standardized quota estimation and storage persistence.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  /**
   * Checks whether persistent storage is supported and already granted.
   */
  async isPersisted(): Promise<boolean> {
    if (typeof navigator !== 'undefined' && navigator.storage?.persisted) {
      try {
        return await navigator.storage.persisted();
      } catch {
        return false;
      }
    }
    return false;
  }

  /**
   * Requests persistent storage permission using standardized `navigator.storage.persist()`.
   */
  async requestPersistence(): Promise<boolean> {
    if (typeof navigator !== 'undefined' && navigator.storage?.persist) {
      try {
        return await navigator.storage.persist();
      } catch {
        return false;
      }
    }
    return false;
  }

  /**
   * Obtains standardized storage quota and usage estimates via `navigator.storage.estimate()`.
   */
  async getEstimate(): Promise<StorageEstimate | null> {
    if (typeof navigator !== 'undefined' && navigator.storage?.estimate) {
      try {
        return await navigator.storage.estimate();
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Safe localStorage accessor with error guarding.
   */
  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {}
    return null;
  }

  setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {}
  }

  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {}
  }
}
