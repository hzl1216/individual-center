'use strict';

const {
  DrugNotFound, DrugExist, TargetExist
} = require('../config/errors');
const {
  Drug, Target
} = require('../models/index')
module.exports = {
  actionCreateDrug: {
    request: {
      contentType: 'application/json',
      body: {
        path: 'string*',
        DrugName: 'string'
      }
    },
    response: {
      200: {
      },
      403: {
        errors:  {
          DrugExist,TargetExist
        }
      },
      contentType: 'application/json'
    },
    store: {
      default: {
        Drug, Target
      }
    }
  },
  actionGetDrugs: {
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
        }
      }
    },
    response: {
      200: {
      },
      contentType: 'application/json'
    },
    store: {
      default: {
        Drug, Target
      }
    }
  },
  actionGetDrug: {
    request: {
      contentType: 'application/json',
      params: {
        DrugName: 'string*'
      }
    },
    response: {
      200: {
      },
      404: {
        errors: {
          DrugNotFound
        }
      },
      contentType: 'application/json'
    },
    store: {
      default: {
        Drug
      }
    }
  },
  actionUpdateDrug: {
    request: {
      contentType: 'application/json',
      body: {
        path: 'string*',
        DrugName: 'string'
      }
    },
    response: {
      200: {
      },
      404: {
        errors: {
          DrugNotFound
        }
      },
      contentType: 'application/json'
    },
    store: {
      default: {
        Drug
      }
    }
  },
  actionDeleteDrug: {
    request: {
      contentType: 'application/json',
      params: {
        DrugName: 'string*'
      }
    },
    response: {
      200: {
      },
      404: {
        errors: {
          DrugNotFound
        }
      },
      contentType: 'application/json'
    },
    store: {
      default: {
        Drug, Target
      }
    }
  },
};
