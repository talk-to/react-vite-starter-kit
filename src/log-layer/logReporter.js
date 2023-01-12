import IDBObjectStore from 'IDBStore/IDBObjectStore';
import { CalendarStore } from 'store/applicationStore';
import { getCalendarConfig, getFcgConfig } from 'helpers/localStorage';
import {
  getPrettyDateWithTz,
  getDateSeparator,
  getClientReloadSeparator,
  getOnlyDate,
} from './utils';

const LOG_OBJECT_STORE = 'Logs';
const HALF_DAY = 12 * 60 * 60 * 1000;
const CLEANUP_INTERVAL = 4 * 60 * 60 * 1000;
const SEVEN_DAYS = 3 * 2 * HALF_DAY;

class LogReporter {
  constructor() {
    this.logStore = new IDBObjectStore(LOG_OBJECT_STORE);
    this.counter = 0;
    this.lastTs = null;
    this.cleanupInterval = CLEANUP_INTERVAL;
    this.longevityTime = SEVEN_DAYS;
    this.cleanup();
    this.addLogsOnClientReload();
    setInterval(this.cleanup, this.cleanupInterval);
  }

  getKey = ts => {
    return `${ts}_${this.counter++}`;
  };

  set = (log, ts = Date.now()) => {
    const key = this.getKey(ts);
    this.logStore.set(log, key);
  };

  /**
   * @param {String} type
   * @param {String} logString
   * @param {Number} ts
   * @description - Adds log in indexed db. Before adding log checks if date of last log is same as of new log if not then appends date separator.
   */
  addLog = (type, logString, ts) => {
    const prettyDateWithTz = getPrettyDateWithTz(ts);
    const log = `${type} ${prettyDateWithTz} ${logString}`;
    this.appendDateSeparator(ts);
    this.set(log, ts);
    this.lastTs = ts;
  };

  addLogsOnClientReload = () => {
    this.appendClientReloadSeparator();
    this.appendLocalStorageData();
  };

  /**
   * @description Cleans logs older than seven days.
   */
  cleanup = () => {
    const lastInvalidKey = `${Date.now() - this.longevityTime}`;
    const keyRangeToBeRemoved = IDBKeyRange.upperBound(lastInvalidKey);
    this.logStore.delete(keyRangeToBeRemoved);
  };

  /**
   * @description Append this separator on client reload.
   */
  appendClientReloadSeparator = () => {
    const ts = Date.now();
    const clientReloadSeparator = getClientReloadSeparator(ts);
    this.set(clientReloadSeparator, ts);
  };

  /**
   * @description Append this separator on date change.
   */
  appendDateSeparator = ts => {
    if (this.shouldAddDateSeparator(ts)) {
      const dateSeparator = getDateSeparator(ts);
      this.set(dateSeparator, ts);
    }
  };

  /**
   * @description Append local storage data on client reload
   */
  appendLocalStorageData = () => {
    const fcgConfig = getFcgConfig();
    const calendarConfig = getCalendarConfig();
    let localStorageData = 'Local storage data: ';
    try {
      const stringifiedFcgConfig = JSON.stringify(fcgConfig);
      const stringifiedCalendarConfig = JSON.stringify(calendarConfig);
      localStorageData += `${stringifiedFcgConfig} \n ${stringifiedCalendarConfig}`;
    } catch (e) {}
    this.set(localStorageData);
  };

  shouldAddDateSeparator = ts => {
    if (!this.lastTs) return true;
    const lastDate = getOnlyDate(this.lastTs);
    const currentDate = getOnlyDate(ts);
    return lastDate !== currentDate;
  };

  getMetaInformation = () => {
    const userAgent = window.navigator.userAgent;
    const clientVersion = CalendarStore.appVersion;
    return `${userAgent} \n Version ${clientVersion}`;
  };

  /**
   * @async
   * @returns {String} Returns log string by concatenating logs array.
   */
  getLogs = async () => {
    const logsArr = await this.logStore.getAll();
    const metaInformation = this.getMetaInformation();
    const logString = `${metaInformation} \n ${logsArr.join('\n')}`;
    return logString;
  };

  /**
   * @async
   * @returns {File} Returns log file created from available logs.
   */
  getLogFile = async () => {
    const logData = await this.getLogs();
    var blob = new Blob([logData], { type: 'text/json' });
    const fileName = `logFile_${Date.now()}`;
    const file = new File([blob], fileName, { type: 'text/json' });
    return file;
  };
}

const logReporter = new LogReporter();
window.getLogFile = logReporter.getLogFile;

export default logReporter;
