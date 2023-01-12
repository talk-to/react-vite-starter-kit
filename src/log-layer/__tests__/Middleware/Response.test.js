import logService from '../../logService';
import logLayer from '../../LogLayer';
import IDBObjectStore from 'IDBStore/IDBObjectStore';
import {
  deltaPollResponse,
  otherResponseObj,
  expectedResponseObj,
} from '../constants';
import { getLastLog } from '../testUtils';

const {
  typeWrappers: { Response },
} = logService;

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

// Response of url type Transaction/delta will not be logged. Because they are polling calls.
describe('Log response of delta poll requests', () => {
  logTypes.forEach(logType => {
    test(`Log delta poll response using ${logType} method`, async () => {
      const logServiceMethod = logService[logType];
      const beforeLog = await getLastLog(logStore);
      logServiceMethod(new Response(deltaPollResponse));
      const afterLog = await getLastLog(logStore);
      expect(nativeConsole[logType]).not.toHaveBeenCalled();
      expect(beforeLog).toBe(afterLog);
    });
  });
});

describe('Log response of other requests', () => {
  logTypes.forEach(logType => {
    test(`Log other responses using ${logType} method`, async () => {
      const logServiceMethod = logService[logType];
      logServiceMethod(new Response(otherResponseObj));
      const afterLog = await getLastLog(logStore);
      expect(nativeConsole[logType]).toHaveBeenCalledWith(expectedResponseObj);
      expect(afterLog).toMatch(JSON.stringify(expectedResponseObj));
    });
  });
});
