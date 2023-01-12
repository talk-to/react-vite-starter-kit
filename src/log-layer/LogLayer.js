import logReporter from './logReporter';
import { allLogLevels, allowedLogLevels, ERROR } from './Config';
import { convertToArray, isProdEnv } from './utils';

class LogLayer {
  enabledLogLevels = {};
  consoleObj = {};

  constructor() {
    this.constructConsoleObj();
    this.setInitialEnabledLogLevels();
    console.native = this.consoleObj;
  }

  /**
   * @description - Creates consoleObj as class property. This will have all(log, error, warn, info, debug) native console methods.
   */
  constructConsoleObj = () => {
    allLogLevels.forEach(logType => {
      this.consoleObj[logType] = console[logType];
    });
  };

  setInitialEnabledLogLevels = () => {
    if (isProdEnv) {
      this.enable([ERROR]);
    } else {
      this.enableAll();
    }
  };

  getNative = () => {
    return this.consoleObj;
  };

  /**
   * @param {String} type
   * @param {Array} logArgs
   * @param {number} ts
   * @param {{ persist?: Boolean }} options
   */
  log = (type, logArgs, ts, options = {}) => {
    if (this.enabledLogLevels[type]) {
      const nativeConsole = this.getNative();
      nativeConsole[type](...logArgs);
    }
    if (this.shouldAddInIDB(type, options)) {
      this.addLogInIDB(type, logArgs, ts);
    }
  };

  shouldAddInIDB = (type, options) => {
    if (allowedLogLevels.includes(type)) {
      return true;
    }
    return options?.persist;
  };

  /**
   * @param {String} type
   * @param {Array} logArgs
   * @param {Number} ts
   * @description - Creates log string by concatenating Json string of every arg.
   */
  addLogInIDB = (type, logArgs, ts) => {
    const logContent = this.getLogContent(logArgs);
    logReporter.addLog(type, logContent, ts);
  };

  getLogContent = args => {
    return args.reduce((content, arg) => {
      return `${content}${JSON.stringify(arg)} `;
    }, '');
  };

  enable = logLevels => {
    logLevels = convertToArray(logLevels);
    logLevels.forEach(level => {
      this.enabledLogLevels[level] = true;
    });
  };

  disable = logLevels => {
    logLevels = convertToArray(logLevels);
    logLevels.forEach(level => {
      this.enabledLogLevels[level] = false;
    });
  };

  enableAll = () => {
    this.enable(allLogLevels);
  };

  disableAll = () => {
    this.disable(allLogLevels);
  };
}

export default new LogLayer();
