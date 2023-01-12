import logController from '../LogController';
import logLayer from '../LogLayer';
import IDBObjectStore from 'IDBStore/IDBObjectStore';
import { getLastLog } from './testUtils';

const logStore = new IDBObjectStore('Logs');
const nativeConsole = logLayer.getNative();
const logTypes = ['log', 'error', 'warn', 'info', 'debug'];

const mockConsoleMethods = () => {
  logTypes.forEach(type => {
    nativeConsole[type] = jest.fn();
  });
};

beforeAll(async () => {
  logController.init();
  await logStore.clear();
  mockConsoleMethods();
});

describe('Console log methods when all log levels are enabled', () => {
  beforeAll(() => {
    logLayer.enableAll();
  });

  beforeEach(() => {
    logTypes.forEach(type => {
      nativeConsole[type].mockReset();
    });
  });

  logTypes.forEach(type => {
    test(`Test console method ${type}`, async () => {
      const logStatement = 'Hello, I am here';
      console[type](logStatement);
      expect(nativeConsole[type]).toHaveBeenCalledWith(logStatement);
      expect.assertions(1);
    });
  });
});

describe('Console log methods when all log levels are disabled', () => {
  beforeAll(() => {
    logLayer.disableAll();
  });
  beforeEach(() => {
    logTypes.forEach(type => {
      nativeConsole[type].mockReset();
    });
  });
  logTypes.forEach(type => {
    test(`Test console method ${type}`, async () => {
      const logStatement = 'Hello, I am here';
      console[type](logStatement);
      expect(nativeConsole[type]).not.toHaveBeenCalled();
      expect.assertions(1);
    });
  });
});

describe('Console log methods when some log levels are enabled', () => {
  const enabledLogLevels = ['error', 'warn'];
  beforeAll(() => {
    logLayer.enable(enabledLogLevels);
  });
  beforeEach(() => {
    logTypes.forEach(type => {
      nativeConsole[type].mockReset();
    });
  });
  logTypes.forEach(type => {
    test(`Test console method ${type}`, async () => {
      const logStatement = 'Hello, I am here';
      console[type](logStatement);
      if (enabledLogLevels.includes(type)) {
        expect(nativeConsole[type]).toHaveBeenCalledWith(logStatement);
      } else {
        expect(nativeConsole[type]).not.toHaveBeenCalled();
      }
      expect.assertions(1);
    });
  });
});

describe('Log persistance in IDB', () => {
  const persistanceAllowedTypes = ['error'];
  beforeAll(async () => {
    logLayer.enableAll();
    logStore.clear();
  });

  beforeEach(async () => {
    return logStore.clear();
  });

  logTypes.forEach(type => {
    test(`Test console method ${type}`, async () => {
      const logStatement = `${type} Hello, I am here`;
      // We cannot be sure that after doing console[method] log will be available immediately in logs DB. But since mock implementation of DB is in memory it will be available right after inserting in it.
      console[type](logStatement);
      const logEntryInIDB = await getLastLog(logStore);
      if (persistanceAllowedTypes.includes(type)) {
        expect(logEntryInIDB).toMatch(logStatement);
        expect(logEntryInIDB).toMatch(type);
        expect.assertions(2);
      } else {
        expect(logEntryInIDB).toBeUndefined();
        expect.assertions(1);
      }
    });
  });
});
