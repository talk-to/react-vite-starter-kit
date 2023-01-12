import IdbStore from '../IDBStore';

describe('Existence of IndexedDB', () => {
  test('IndexedDB is defined on window object', () => {
    expect(window.indexedDB).toBeDefined();
  });

  test('IndexedDB is defined on IdbStore obj', async () => {
    const idb = await IdbStore.getIDB();
    expect(idb).toBeDefined();
  });
});

describe('Perform actions on IndexedDB', () => {
  const key = 'testKey';
  const value = 'testValue';
  const objectStore = 'Logs';
  const invalidObjectStore = 'invalid';

  test('set a value on valid object store', async () => {
    const keyFromIdb = await IdbStore.set(objectStore, value, key);
    const valueFromIdb = await IdbStore.get(objectStore, key);
    expect(valueFromIdb).toBe(value);
    expect(keyFromIdb).toBe(key);
  });

  test('set a value on invalid object store', async () => {
    try {
      await IdbStore.set(invalidObjectStore, value, key);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
    expect.assertions(1);
  });

  test('get a value on valid object store', async () => {
    const valueFromIdb = await IdbStore.get(objectStore, key);
    expect(valueFromIdb).toBe(value);
  });

  test('get a value on invalid object store', async () => {
    try {
      await IdbStore.get(invalidObjectStore, key);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
    expect.assertions(1);
  });

  test('delete a value on valid object store', async () => {
    await IdbStore.delete(objectStore, key);
    const valueFromIdb = await IdbStore.get(objectStore, key);
    expect(valueFromIdb).toBeUndefined();
  });

  test('delete a value on invalid object store', async () => {
    try {
      await IdbStore.delete(invalidObjectStore, key);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
    expect.assertions(1);
  });
});
