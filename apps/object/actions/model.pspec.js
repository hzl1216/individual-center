'use strict';
const {
    Model,
    Task, 
    RawData,
    ProcessedData,
    Param
} = require('../models/index');
const {
  TaskExist, ModelExist,ModelNotExist
} = require('../config/errors');

module.exports = {
    actionCreateModel: {
    request: {
      contentType: 'application/json',
      body: {
        type: 'string*',
        description: 'string*',
        modelurl: 'string*',
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
        }
      },
      403: {
        errors: {
            ModelExist
        }
      },
      contentType: 'application/json'
    },
    store: {
      default: {
        Model, Param

      }
    },
    permission: 'login'

  },
  actionUpdateModel: {
    request: {
      contentType: 'application/json',
      body: {
        type: 'string',
        description: 'string',
        modelurl: 'string',
        modelname: 'string*',
        status: 'string'
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
        }
      },
      contentType: 'application/json'
    },
    store: {
      default: {
        Model
      }
    }
  },
  actionGetModels: {
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
        Model
      }
    }
  },
  actionGetModel: {
    request: {
      contentType: 'application/json',
      params: {
        id: 'string*'
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
      contentType: 'application/json'
    },
    store: {
      default: {
        Model
      }
    }
  },
  actionDeleteModel: {
    request: {
      contentType: 'application/json',
      params: {
        id: 'string*'
      }
    },
    response: {
      200: {
      },
      404: {
        errors: {
          ModelNotExist,
        }
      },
      contentType: 'application/json'
    },
    store: {
      default: {
        Model
      }
    }
  },
};
