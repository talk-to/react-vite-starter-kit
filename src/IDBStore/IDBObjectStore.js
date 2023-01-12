import IdbStore from './IDBStore';

class IDBObjectStore {
  /**
   * @constructor
   * @param {String} objectStoreName
   */
  constructor(objectStoreName) {
    this.objectStoreName = objectStoreName;
  }

  /**
   * @param  {...any} args
   * @returns Get the value
   */
  get = async (...args) => {
    return IdbStore.get(this.objectStoreName, ...args);
  };

  /**
   * @param  {...any} args
   * @returns Get All the values
   */
  getAll = async (...args) => {
    return IdbStore.getAll(this.objectStoreName, ...args);
  };

  /**
   * @param  {...any} args
   * @returns Set the value
   */
  set = async (...args) => {
    return IdbStore.set(this.objectStoreName, ...args);
  };

  /**
   * @param  {...any} args
   * @returns Delete the value
   */
  delete = async (...args) => {
    return IdbStore.delete(this.objectStoreName, ...args);
  };

  /**
   * @param  {...any} args
   * @returns Clears the object store
   */
  clear = async (...args) => {
    return IdbStore.clear(this.objectStoreName, ...args);
  };
}

export default IDBObjectStore;
