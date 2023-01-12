/**
 * @param {Any} db
 * @param {String} name
 * @description Creates object store with name provided in argument. Logs error if something goes wrong
 */
export const createObjectStore = (db, name) => {
  try {
    db.createObjectStore(name);
  } catch (e) {
    console.error('cannot create object store', name, e);
  }
};

/**
 * @param {Any} db
 * @param {String} name
 * @description Deletes object store with name provided in argument. Logs error if something goes wrong
 */
export const deleteObjectStore = (db, name) => {
  try {
    db.deleteObjectStore(name);
  } catch (e) {
    console.error('cannot delete object store', name, e);
  }
};
