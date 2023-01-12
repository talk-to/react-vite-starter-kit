import response from './Middleware/Response';
import eventResponse from './Middleware/EventResponse';
import errorResponse from './Middleware/ErrorResponse';

export const allLogLevels = ['error', 'warn', 'info', 'log', 'debug'];
export const allLogTypes = ['error', 'warn', 'info', 'log', 'debug'];
export const allowedLogLevels = ['error'];
export const ERROR = 'error';

export const CLIENT_RELOAD_SEPARATOR_TEMPLATE = `################### Client reloaded at {ISODate} ##########################`;
export const DATE_SEPARATOR_TEMPLATE = `######################## {Date} ##############################`;

/**
 * @type {Object.<string, { prefix: String, enabled: boolean }>}
 */
export const namespaces = {
  Axios: {
    prefix: 'Axios::',
    enabled: true,
  },
  App: {
    prefix: 'App::',
    enabled: true,
  },
  Event: {
    prefix: 'Event::',
    enabled: true,
  },
  ServiceWorker: {
    prefix: 'ServiceWorker::',
    enabled: true,
  },
  EventService: {
    prefix: 'Event Service::',
    enabled: true,
  },
  Delta: {
    prefix: 'Delta::',
    enabled: true,
  },
};

/**
 * @type {{filter: Function }[]}
 */
export const middlewareFilters = [response, eventResponse, errorResponse];

/**
 * @type {Object.<string, Class>}
 */
export const typeWrappers = {
  Response: response.Response,
  EventResponse: eventResponse.EventResponse,
  ErrorResponse: errorResponse.ErrorResponse,
};
