import IDBObjectStore from '../IDBObjectStore';

const objectStore = 'Logs';
const logStore = new IDBObjectStore(objectStore);

beforeAll(async () => {
  return logStore.clear(objectStore);
});

describe('Perform actions on IndexedDB', () => {
  const key = 'testKey';
  const value = 'testValue';
  const invalidKey = 'invalidKey';

  test('set a key value pair', async () => {
    const keyFromIdb = await logStore.set(value, key);
    const valueFromIdb = await logStore.get(key);
    expect(valueFromIdb).toBe(value);
    expect(keyFromIdb).toBe(key);
  });

  test('get a value using valid key', async () => {
    const valueFromIdb = await logStore.get(key);
    expect(valueFromIdb).toBe(value);
  });

  test('get a value using invalid key', async () => {
    const valueFromIdb = await logStore.get(invalidKey);
    expect(valueFromIdb).toBeUndefined();
  });

  test('delete a value using valid key', async () => {
    await logStore.delete(key);
    expect(logStore.get(key)).resolves.toBeUndefined();
  });

  test('delete a value using invalid key', async () => {
    await logStore.delete(invalidKey);
  });
});
