Log-layer 

1. Log-layer.js
   1. This module manages enabled log levels. Only enabled log-levels will be logged to the console. Enabled log levels for dev environments will be all log types and for prod it will be only error.
   1. This component also checks if log should be added in IDB or not. If it is then use logReporter to add log in IDB. By default console.error logs will only be added to IDB. If it specifically receives options of persisting in IDB then it will not check the log type.
   1. This module will be a single instance of class.
   1. Instance will be available in window.console.logLayer
1. Log controller
   1. This module controls the log-layer and starting point of initialization. 
   1. This is also a single instance of class.
   1. This overrides default console methods and assigns custom methods.
   1. It also sanitizes sensitive data from logs. For that it uses middleware.  If you want to sanitize some other data then write your own middleware and add it to the list of middlewares. Check the middleware section to check how to write middleware.
   1. It also has a separate method to log the data which will always persist in IDB. But do not use that method directly instead use log service for tasks.
1. Log service
   1. This service should be used when you want to specifically add some permanent logs in IDB. 
   1. This module also supports namespace.
   1. This module will be a proxy object.
   1. You can import logService like this. Then you can use logService.log, logService.error etc methods. If you want to use namespace then use it like logService.NameSpace.log, logService.NameSpace.error. 
   1. But make sure the namespace you provide should be present in config. Otherwise it won’t get persisted. From namespace config you can disable specific namespace and all the logs of that namespace will not be logged or persisted.
1. Log reporter 
   1. This module manages storing and retrieving logs from IDB.
   1. This is a single instance of class.
   1. ` `It also removes logs older than their longevity time.
   1. It has a method to retrieve all logs in file.
   1. It also appends proper date and client reload separators in IDB.
1. Middleware
   1. This should be a single instance of class.
   1. Two methods should be present there. 
      1. Should log (logArgs)
         1. Checks that this log should be logged or not.
      1. Filter(logArgs)
         1. Returns filtered and sanitized log args which can be then logged.

