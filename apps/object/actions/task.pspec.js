'use strict';
const {
    Model,
    Task, 
    RawData,
    ProcessedData
} = require('../models/index');
const {
  TaskExist, ModelExist,ModelNotExist,TaskNotExist
} = require('../config/errors');

module.exports = {
  actionCreateTask: {
    request: {
      contentType: 'application/json',
      body: {
        taskname: 'string*',
        description: 'string*',
        rawurl: 'string*',
        rawtype: 'string*',
        modelname: 'string*',
        inputparams: 'string*',
        outparams: 'string*',
      }
    },
    response: {
      200: {
      },
      404: {
        errors: {
            ModelNotExist
        }
      },
      403: {
        errors: {
            TaskExist, ModelExist
        }
      },
      contentType: 'application/json'
    },
    store: {
      default: {
        Model,
        Task, 
        RawData,
        ProcessedData
      }
    },
    permission: 'login'
  },
  actionUpdateStatus: {
    request: {
      contentType: 'application/json',
      body: {
        id: 'string*',
        status: 'string*'
      }
    },
    response: {
      200: {
      },
      404: {
        errors: {
            TaskNotExist
        }

      },
      403: {
        errors: {
        }
      },
      contentType: 'application/json'
    },
    store: {
      default: {
        Task
      }
    }
  },
  actionGetTasks: {
    request: {
      contentType: 'application/json',
      query: {
        skip: {
          $type: 'integer',
          $default: 0
        },
        limit: {
          $type: 'integer',
          $default: 10
        },
        status: 'string'
      }
    },
    response: {
      200: {
      },
      contentType: 'application/json'
    },
    store: {
      default: {
        Task
      }
    }
  },
};
