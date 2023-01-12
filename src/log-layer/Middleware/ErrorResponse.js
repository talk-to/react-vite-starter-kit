import { selectPropsFromTemplate } from '../utils';

const TEMPLATE_OBJ = {
  config: {
    params: '',
    data: '',
    baseURL: '',
    url: '',
  },
  response: {
    status: '',
    data: {
      detail: '',
      error: '',
      parameter: '',
    },
  },
};

class ErrorResponse {
  constructor(responseObj) {
    this.type = 'ErrorResponse';
    this.data = responseObj;
  }
}

class ErrorResponseMiddleware {
  ErrorResponse = ErrorResponse;

  isErrorResponseObj = obj => {
    return obj instanceof ErrorResponse;
  };

  filter = logArgs => {
    return logArgs.map(arg => {
      const filteredArg = this.filterArg(arg);
      return filteredArg;
    });
  };

  filterArg = arg => {
    if (this.isErrorResponseObj(arg)) {
      const actualArg = { ...arg.data };
      const reducers = [this.stripSensitiveProps];
      return reducers.reduce((acc, reducer) => reducer(acc), actualArg);
    }
    return arg;
  };

  stripSensitiveProps = errorResponse => {
    return selectPropsFromTemplate(errorResponse, TEMPLATE_OBJ);
  };
}

const errorResponse = new ErrorResponseMiddleware();

export default errorResponse;
