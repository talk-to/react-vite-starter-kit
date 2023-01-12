export const DB_Name = 'Calendar';
export const CURRENT_IDB_VERSION = 1;

/**
 * @type { Object.<string, { tableName: String, startVersion: number, endVersion?: number }> }
 */
export const objectStores = {
  Logs: {
    tableName: 'Logs',
    startVersion: 1,
  },
};
