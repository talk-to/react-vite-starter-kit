import moment from 'moment-timezone';
import {
  namespaces,
  DATE_SEPARATOR_TEMPLATE,
  CLIENT_RELOAD_SEPARATOR_TEMPLATE,
} from './Config';

export const isProdEnv = (() => {
  return process.env.NODE_ENV === 'production';
})();

/**
 * @param {String} namespace
 * @returns {Boolean} Returns true if namespace is enabled.
 */
export const isNameSpaceEnabled = namespace => {
  if (!namespace) return true;
  const namespaceObj = namespaces[namespace];
  return namespaceObj && namespaceObj.enabled;
};

/**
 * @param {String} namespace
 * @returns {String} Extract namespace prefix from namespace obj
 */
export const getPrefixForNameSpace = namespace => {
  const namespaceObj = namespaces[namespace];
  return namespaceObj?.prefix || namespace;
};

/**
 * @param {Number} ts
 * @returns {String} - Date in YYYY-MM-DDTHH:MM:SSZ format
 */
export const getPrettyDateWithTz = ts => {
  return moment(ts).format();
};

/**
 * @param {Number} ts
 * @returns {String} - Date in DD/MM/YYYY format
 */
export const getOnlyDate = ts => {
  return moment(ts).format('DD/MM/YYYY');
};

/**
 * @param {Number} ts
 * @returns {String} - Returns date separator string with timestamp converted to date.
 */
export const getDateSeparator = ts => {
  const prettyDate = getOnlyDate(ts);
  return DATE_SEPARATOR_TEMPLATE.replace('{Date}', prettyDate);
};

/**
 * @param {Number} ts
 * @returns {String} - Returns client reload separator string with timestamp converted to pretty date.
 */
export const getClientReloadSeparator = ts => {
  const prettyDateWithTz = getPrettyDateWithTz(ts);
  return CLIENT_RELOAD_SEPARATOR_TEMPLATE.replace(
    '{ISODate}',
    prettyDateWithTz
  );
};

export const convertToArray = arg => {
  if (!Array.isArray(arg)) {
    return [arg];
  }
  return arg;
};

/**
 * Selects Props from target object based on template obj
 * @param {Object} target
 * @param {Object} template
 * @returns {Object}
 */
export const selectPropsFromTemplate = (target, template) => {
  if (target && _isObjectType(target)) {
    const result = !_isObjectType(template) ? target : {};
    Object.keys(template).forEach(key => {
      const value = target[key];
      result[key] = selectPropsFromTemplate(value, template[key]);
    });
    return result;
  }
  return target;
};

const _isObjectType = value => {
  return value instanceof Object && !Array.isArray(value);
};
