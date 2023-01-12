import logLayer from './LogLayer';
import { allLogTypes, middlewareFilters } from './Config';

class LogController {
  init = () => {
    this.overrideDefaultConsoleMethods();
    window.console.logLayer = logLayer;
  };

  overrideDefaultConsoleMethods = () => {
    const originalConsole = window.console;
    allLogTypes.forEach(logType => {
      originalConsole[logType] = this.consoleLog.bind(this, logType);
    });
  };

  consoleLog = (type, ...args) => {
    const logArr = this.sanitize(args);
    const ts = Date.now();
    logLayer.log(type, logArr, ts);
  };

  log = (type, ...args) => {
    const logArr = this.sanitize(args);
    const shouldLog = this.shouldLog(args);
    if (shouldLog) {
      const ts = Date.now();
      logLayer.log(type, logArr, ts, { persist: true });
    }
  };

  sanitize = args => {
    const _args = [...args];
    return middlewareFilters.reduce((acc, { filter }) => {
      return filter(acc);
    }, _args);
  };

  shouldLog = args => {
    let result = true;
    middlewareFilters.forEach(({ shouldLog }) => {
      if (shouldLog && !shouldLog(args)) result = false;
    });
    return result;
  };

  nativeLog = (type, ...args) => {
    const nativeConsole = logLayer.getNative();
    nativeConsole[type](...args);
  };
}

export default new LogController();
