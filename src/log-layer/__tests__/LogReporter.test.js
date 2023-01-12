import logReporter from '../logReporter';
import IDBObjectStore from 'IDBStore/IDBObjectStore';
import { getOnlyDate } from '../utils';
import { getLastLog } from './testUtils';

const logStore = new IDBObjectStore('Logs');
const MINUTE = 60 * 10000;
const DAY = 24 * 60 * MINUTE;

// Adding custom matcher to jest
expect.extend({
  toContainValues(received, expected) {
    let pass = true;
    const receivedString = received.reduce((acc, log) => acc + log + ' ', '');
    pass = expected.reduce(
      (pass, expectedLog) => pass && receivedString.includes(expectedLog),
      pass
    );
    return { pass, message: () => 'passed ' + pass };
  },
});

describe('Test initialization ', () => {
  test('Client reload separator should be present on initialization', async () => {
    const lastLogEntry = await getLastLog(logStore);
    expect(lastLogEntry).toMatch('Client reloaded at');
    expect.assertions(1);
  });
});

describe('Test date separator', () => {
  const referenceTime = Date.now();
  beforeAll(async () => {
    return logStore.clear();
  });

  test('Add a log', async () => {
    const content = 'Hello, I am here';
    const ts = referenceTime + 100;
    logReporter.addLog('log', content, ts);
    const lastLogEntry = await getLastLog(logStore);
    expect(lastLogEntry).toMatch(content);
    expect(lastLogEntry).toMatch('log');
    expect.assertions(2);
  });

  test('Add a log with same date', async () => {
    const content = 'Hello, I am here';
    const ts = referenceTime + 500;
    logReporter.addLog('error', content, ts);
    const lastLogEntry = await getLastLog(logStore);
    expect(lastLogEntry).toMatch(content);
    expect(lastLogEntry).toMatch('error');
    expect.assertions(2);
  });

  test('Add a log with different date', async () => {
    const content = 'Hello, I am here';
    const ts = referenceTime + DAY;
    logReporter.addLog('error', content, ts);
    const [dateSeparator, lastLogEntry] = await getLastLog(logStore, 2);
    expect(lastLogEntry).toMatch(content);
    expect(lastLogEntry).toMatch('error');
    expect(dateSeparator).toMatch(getOnlyDate(ts));
    expect.assertions(3);
  });
});

describe('Remove logs older than longevity', () => {
  const referenceTime = Date.now();
  const logsBefore30Minutes = ['testBefore1', 'testBefore2'];
  const logsCurrent = ['testCurrent1', 'testCurrent2'];
  const logsFuture30Minute = ['testFuture1', 'testFuture2'];
  beforeAll(async () => {
    await logStore.clear();
    logsBefore30Minutes.forEach(log => {
      logReporter.addLog('error', log, referenceTime - 30 * MINUTE);
    });
    logsCurrent.forEach(log => {
      logReporter.addLog('log', log, referenceTime);
    });
    logsFuture30Minute.forEach(log => {
      logReporter.addLog('info', log, referenceTime + 30 * MINUTE);
    });
  });

  test('Remove logs older than 50 minutes', async () => {
    logReporter.longevityTime = 50 * MINUTE;
    const logsBeforeCleanup = await logStore.getAll();
    logReporter.cleanup();
    const logsAfterCleanup = await logStore.getAll();
    expect(logsBeforeCleanup).toEqual(logsAfterCleanup);
    expect.assertions(1);
  });

  test('Remove logs older than 30 minutes', async () => {
    logReporter.longevityTime = 30 * MINUTE - 1;
    const logsBeforeCleanup = await logStore.getAll();
    logReporter.cleanup();
    const logsAfterCleanup = await logStore.getAll();
    expect(logsBeforeCleanup).toContainValues([
      ...logsBefore30Minutes,
      ...logsCurrent,
      ...logsFuture30Minute,
    ]);
    expect(logsAfterCleanup).toContainValues([
      ...logsCurrent,
      ...logsFuture30Minute,
    ]);
    expect(logsAfterCleanup).not.toContainValues([...logsBefore30Minutes]);
    expect.assertions(3);
  });

  test('Remove logs older than current time', async () => {
    logReporter.longevityTime = 0;
    const logsBeforeCleanup = await logStore.getAll();
    logReporter.cleanup();
    const logsAfterCleanup = await logStore.getAll();
    expect(logsBeforeCleanup).toContainValues([
      ...logsCurrent,
      ...logsFuture30Minute,
    ]);
    expect(logsAfterCleanup).toContainValues([...logsFuture30Minute]);
    expect(logsAfterCleanup).not.toContainValues([...logsCurrent]);
    expect.assertions(3);
  });
});

describe('Get log file', () => {
  test('Get all logs as file', async () => {
    const logFile = await logReporter.getLogFile();
    expect(logFile).toBeInstanceOf(Blob);
    expect(logFile.type).toBe('text/json');
    expect.assertions(2);
  });
});
