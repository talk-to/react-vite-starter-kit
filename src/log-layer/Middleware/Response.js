const TEMPLATE_OBJ = {
  config: {
    baseURL: '',
    url: '',
    params: '',
    data: '',
  },
  status: '',
};

class Response {
  constructor(responseObj) {
    this.type = 'Response';
    this.data = responseObj;
  }
}

const ignoreUrls = ['transactions/getDelta'];

class ResponseMiddleware {
  Response = Response;

  isResponseObj = obj => {
    return obj instanceof Response;
  };

  shouldLog = logArgs => {
    let result = true;
    logArgs.forEach(arg => {
      if (this.isResponseObj(arg)) {
        const { data: { config: { url } = {} } = {} } = arg || {};
        if (ignoreUrls.includes(url)) {
          result = false;
        }
      }
    });
    return result;
  };

  filter = logArgs => {
    return logArgs.map(arg => {
      const filteredArg = this.filterArg(arg);
      return filteredArg;
    });
  };

  filterArg = arg => {
    if (this.isResponseObj(arg)) {
      const actualArg = { ...arg.data };
      const reducers = [this.stripSensitiveProps];
      return reducers.reduce((acc, reducer) => reducer(acc), actualArg);
    }
    return arg;
  };

  stripSensitiveProps = response => {
    return this.selectPropsFromTemplate(response, TEMPLATE_OBJ);
  };

  selectPropsFromTemplate = (target, template) => {
    if (target && target instanceof Object && !Array.isArray(target)) {
      const result = {};
      Object.keys(template).forEach(key => {
        const value = target[key];
        result[key] = this.selectPropsFromTemplate(value, template[key]);
      });
      return result;
    }
    return target;
  };
}

const response = new ResponseMiddleware();

export default response;
