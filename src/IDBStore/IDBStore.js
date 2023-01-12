import { openDB } from 'idb';
import { CURRENT_IDB_VERSION, DB_Name, objectStores } from './Config';
import { createObjectStore, deleteObjectStore } from './utils';

const objectStoreNames = Object.keys(objectStores);

/**
 * @description - If we want to have logs only in console not in IDB. Then we need to use actual console method so that it only prints in console.
 * We want to have that functionality here because if some method of IDBStore gets errored and we try to log that error then it will again trigger IDB method and it will go infinite.
 * @returns Returns object containing actual console methods.
 */
const getNativeConsole = () => {
  if (console.native) return console.native;
  return console;
};

class IDBStore {
  dbPromise = null;
  initialized = false;

  /**
   * @returns {Promise} Db promise
   */
  init = async () => {
    this.dbPromise = openDB(DB_Name, CURRENT_IDB_VERSION, {
      upgrade: this.upgradeNeeded,
      blocked: this.onBlocked,
      blocking: this.onBlocking,
    });
    this.initialized = true;
    return this.dbPromise;
  };

  getIDB = async () => {
    if (this.initialized) {
      return await this.dbPromise;
    } else {
      return await this.init();
    }
  };

  upgradeNeeded = (db, oldVersion, newVersion) => {
    this.removeOlderObjectStores(db, newVersion);
    this.addLatestObjectStores(db, oldVersion);
  };

  /**
   * @param {*} db
   * @param {Number} newVersion
   * @description - Removes older object stores which are no longer valid for newer DB.
   */
  removeOlderObjectStores = (db, newVersion) => {
    objectStoreNames.forEach(objectStoreName => {
      const objectStore = objectStores[objectStoreName];
      if (objectStore.endVersion && objectStore.endVersion < newVersion) {
        deleteObjectStore(db, objectStoreName);
      }
    });
  };

  /**
   * @param {*} db
   * @param {Number} oldVersion
   * @description - Adds newer object stores which were not present on previous DB.
   */
  addLatestObjectStores = (db, oldVersion) => {
    objectStoreNames.forEach(objectStoreName => {
      const objectStore = objectStores[objectStoreName];
      if (objectStore.startVersion && objectStore.startVersion > oldVersion) {
        createObjectStore(db, objectStoreName);
      }
    });
  };

  onBlocked = () => {
    getNativeConsole().error(
      'Cannot open DB as another older DB is open on the same origin'
    );
  };

  // Same as onVersionChange event in plain IDB
  onBlocking = () => {
    getNativeConsole().error(
      'This connection is blocking a future version of the database from opening.'
    );
  };

  /**
   * @param {string} objectStoreName
   * @param {string} key
   * @returns {Promise<String>} Value of item with key in objectStore
   */
  get = async (objectStoreName, key) => {
    try {
      return (await this.getIDB()).get(objectStoreName, key);
    } catch (e) {
      getNativeConsole().error('Error ocurred in IDB method get', e);
      throw e;
    }
  };

  /**
   * @param {string} objectStoreName
   * @returns {Promise<String>} All the values in object store
   */
  getAll = async objectStoreName => {
    try {
      return (await this.getIDB()).getAll(objectStoreName);
    } catch (e) {
      getNativeConsole().error('Error ocurred in IDB method getAll');
      throw e;
    }
  };

  /**
   * @param {String} objectStoreName
   * @param {String} value
   * @param {String} key
   * @returns Sets the value against key in object store
   */
  set = async (objectStoreName, value, key) => {
    try {
      return (await this.getIDB()).put(objectStoreName, value, key);
    } catch (e) {
      getNativeConsole().error('Error ocurred in IDB method set', e);
      throw e;
    }
  };

  /**
   * @param {String} objectStoreName
   * @param {String} key
   * @returns Deletes the item with key in object store
   */
  delete = async (objectStoreName, key) => {
    try {
      return (await this.getIDB()).delete(objectStoreName, key);
    } catch (e) {
      getNativeConsole().error('Error ocurred in IDB method delete', e);
      throw e;
    }
  };

  /**
   * @param {String} objectStoreName
   * @description Clears the object store
   */
  clear = async objectStoreName => {
    try {
      return (await this.getIDB()).clear(objectStoreName);
    } catch (e) {
      getNativeConsole().error('Error ocurred in IDB method clear', e);
      throw e;
    }
  };
}

export default new IDBStore();
