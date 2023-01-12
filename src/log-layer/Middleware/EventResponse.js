class EventResponse {
  constructor(responseObj) {
    this.type = 'Event Response';
    this.data = responseObj;
  }
}

class EventResponseMiddleware {
  EventResponse = EventResponse;

  isEventResponseObj = obj => {
    return obj instanceof EventResponse;
  };

  filter = logArgs => {
    return logArgs.map(arg => {
      const filteredArg = this.filterArg(arg);
      return filteredArg;
    });
  };

  filterArg = arg => {
    if (this.isEventResponseObj(arg)) {
      const eventsArr = arg.data.data?.events || [];
      const reducers = [this.stripSensitivePropsFromEvent];
      return eventsArr.map(event =>
        reducers.reduce((acc, reducer) => reducer(acc), event)
      );
    }
    return arg;
  };

  stripSensitivePropsFromEvent = e => {
    e = e || {};
    const { event = {} } = e;
    const formattedEvent = this.formatEvent(event);
    return {
      ...e,
      event: formattedEvent,
    };
  };

  formatEvent = event => {
    return { ...event, title: event?.eventInfo?.title, eventInfo: '' };
  };
}

const eventResponse = new EventResponseMiddleware();

export default eventResponse;
