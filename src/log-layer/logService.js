import logController from './LogController';
import { allLogTypes, typeWrappers } from './Config';
import { isNameSpaceEnabled, getPrefixForNameSpace } from './utils';

class LogService {
  /**
   * @param {string} namespace - namespace for log service
   */
  constructor(namespace) {
    this.namespace = namespace;
    this.isNameSpaceEnabled = isNameSpaceEnabled(this.namespace);
    this.namespacePrefix = getPrefixForNameSpace(this.namespace);
    this.nativeConsole = {};
    this.typeWrappers = typeWrappers;
    this.setupLogMethods();
    this.setupNativeLogMethods();
  }

  getPrefixes = () => {
    if (this.namespacePrefix) return [this.namespacePrefix];
    return [];
  };

  setupLogMethods = () => {
    allLogTypes.forEach(logType => {
      this[logType] = this._log.bind(this, logType);
    });
  };

  _log = (type, ...args) => {
    if (this.isNameSpaceEnabled) {
      const prefixes = this.getPrefixes();
      logController.log(type, ...[...prefixes, ...args]);
    }
  };

  setupNativeLogMethods = () => {
    allLogTypes.forEach(logType => {
      this.nativeConsole[logType] = this._nativeLog.bind(this, logType);
    });
  };

  _nativeLog = (type, ...args) => {
    const prefixes = this.getPrefixes() || [];
    logController.nativeLog(type, ...[...prefixes, ...args]);
  };
}

const withNameSpaces = () => {
  const logService = new LogService();
  const proxyHandlers = {
    get(target, key) {
      if (!target[key]) {
        target[key] = new LogService(key);
      }
      return target[key];
    },
  };
  return new Proxy(logService, proxyHandlers);
};

/**
 * @type {{log: Function, error: Function, warn: Function, info: Function, debug: Function, nativeConsole: Object}}
 */
const logServiceWithNameSpace = withNameSpaces();

export default logServiceWithNameSpace;
