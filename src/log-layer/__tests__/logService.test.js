import logService from '../logService';
import logLayer from '../LogLayer';
import IDBObjectStore from 'IDBStore/IDBObjectStore';
import { getLastLog } from './testUtils';
import { namespaces } from '../Config';

const logStore = new IDBObjectStore('Logs');
const logTypes = ['log', 'error', 'warn', 'info', 'debug'];
const nativeConsole = logLayer.getNative();

const mockConsoleMethods = () => {
  logTypes.forEach(type => {
    nativeConsole[type] = jest.fn();
  });
};

beforeAll(() => {
  mockConsoleMethods();
});

// Without namespace
describe('Use log service without namespace', () => {
  logTypes.forEach(logType => {
    test(`Test log service method ${logType}`, async () => {
      const logContent = 'Hello, I am here for testing';
      const testArray = ['test1', 'test2'];
      const logServiceMethod = logService[logType];
      logServiceMethod(logContent, testArray);
      expect(nativeConsole[logType]).toHaveBeenCalledWith(
        logContent,
        testArray
      );
      const lastLogEntry = await getLastLog(logStore);
      expect(lastLogEntry).toMatch(logContent);
      expect(lastLogEntry).toMatch(JSON.stringify(testArray));
      expect(lastLogEntry).toMatch(logType);
      expect.assertions(4);
    });
  });
});

// With enabled namespace
describe('Use log service with enabled namespace', () => {
  const AxiosLogService = logService.Axios;
  const {
    Axios: { prefix: axiosPrefix },
  } = namespaces;

  logTypes.forEach(logType => {
    test(`Test log service method ${logType}`, async () => {
      const logContent = 'Hello, I am here for testing';
      const testArray = ['test1', 'test2'];
      const logServiceMethod = AxiosLogService[logType];
      logServiceMethod(logContent, testArray);
      expect(nativeConsole[logType]).toHaveBeenCalledWith(
        axiosPrefix,
        logContent,
        testArray
      );
      const lastLogEntry = await getLastLog(logStore);
      expect(lastLogEntry).toMatch(logContent);
      expect(lastLogEntry).toMatch(JSON.stringify(testArray));
      expect(lastLogEntry).toMatch(logType);
      expect(lastLogEntry).toMatch(axiosPrefix);
      expect.assertions(5);
    });
  });
});

// With disabled namespace or undefined namespace
describe('Use log service with disabled or undefined namespace', () => {
  const UndefinedLogService = logService.Undefined;

  logTypes.forEach(logType => {
    test(`Test log service method ${logType}`, async () => {
      const logContent = 'Hello, I am here for testing';
      const testArray = ['test1', 'test2'];
      const logServiceMethod = UndefinedLogService[logType];
      const beforeLastLogEntry = await getLastLog(logStore);
      logServiceMethod(logContent, testArray);
      expect(nativeConsole[logType]).not.toHaveBeenCalled();
      const lastLogEntry = await getLastLog(logStore);
      expect(beforeLastLogEntry).toBe(lastLogEntry);
      expect.assertions(2);
    });
  });
});
