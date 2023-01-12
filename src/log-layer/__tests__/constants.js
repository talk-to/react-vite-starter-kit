export const deltaPollResponse = {
  data: {
    transactionId: '6811246869007598810_6853635982348025965',
  },
  status: 200,
  statusText: '',
  headers: {
    'content-type': 'application/json;charset=utf-8',
  },
  config: {
    url: 'transactions/getDelta',
    method: 'get',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'X-Session-Token': '1:ToUJWe82TWjGsdCZKRXTFcV7w666v25C',
      'X-API-Endpoint': 'https://flockmail-backend.flock-staging.com/s/1/3598/',
    },
    params: {
      transactionId: '6811246869007598810_6853635982348025965',
      onlySilent: false,
      api: 'https://flockmail-backend.flock-staging.com/s/1/3598/',
      token: '1:ToUJWe82TWjGsdCZKRXTFcV7w666v25C',
    },
    baseURL: 'https://flockmail-backend.flock-staging.com/kairos/',
    transformRequest: [null],
    transformResponse: [null],
    timeout: 0,
    responseType: 'json',
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    maxContentLength: -1,
    maxBodyLength: -1,
    transitional: {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false,
    },
  },
  request: {},
};

export const otherResponseObj = {
  data: {
    events: [],
    syncToken:
      'xo7ffbf6605548ba4e2a5980788c89df14b7ff0281a259e2aa29dc8b426ae855c3591aef1e489ae70f86863a299b62b87dd4d5e0254a03d0b241a3a66803c632aeba008c9104afb90f75906dbcddb9966bf6d91032475c2521f5268158cb348d2c69d5',
  },
  status: 200,
  statusText: '',
  headers: {
    'content-type': 'application/json;charset=utf-8',
  },
  config: {
    url: 'calendars/6815948711536920398/events/fetch',
    method: 'post',
    data: '{"timeZone":"Asia/Kolkata","startTime":"2021-09-22T00:00:00+05:30","endTime":"2022-01-08T00:00:00+05:30","timeFormat":"iso"}',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'X-Session-Token': '1:ToUJWe82TWjGsdCZKRXTFcV7w666v25C',
      'X-API-Endpoint': 'https://flockmail-backend.flock-staging.com/s/1/3598/',
    },
    params: {
      api: 'https://flockmail-backend.flock-staging.com/s/1/3598/',
      token: '1:ToUJWe82TWjGsdCZKRXTFcV7w666v25C',
    },
    baseURL: 'https://flockmail-backend.flock-staging.com/kairos/',
    transformRequest: [null],
    transformResponse: [null],
    timeout: 0,
    responseType: 'json',
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    maxContentLength: -1,
    maxBodyLength: -1,
    transitional: {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false,
    },
  },
  request: {},
};

export const expectedResponseObj = {
  config: {
    baseURL: 'https://flockmail-backend.flock-staging.com/kairos/',
    method: 'post',
    url: 'calendars/6815948711536920398/events/fetch',
    params: { api: 'https://flockmail-backend.flock-staging.com/s/1/3598/' },
  },
  status: 200,
};
