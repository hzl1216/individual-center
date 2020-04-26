'use strict';

const {
  IndividualNotFound, IndividualExist
} = require('../config/errors');
const {
  Individual, Clinical, Tissue
} = require('../models/index')
module.exports = {
  actionCreateIndividual: {
    request: {
      contentType: 'application/json',
      body: {
        path: 'string*',
        individualId: 'string'
      }
    },
    response: {
      200: {
      },
      403: {
        errors:  {
          IndividualExist
        }
      },
      contentType: 'application/json'
    },
    store: {
      default: {
        Individual
      }
    }
  },
  actionGetIndividuals: {
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
        Individual
      }
    }
  },
  actionGetIndividual: {
    request: {
      contentType: 'application/json',
      params: {
        individualId: 'string*'
      }
    },
    response: {
      200: {
      },
      404: {
        errors: {
          IndividualNotFound
        }
      },
      contentType: 'application/json'
    },
    store: {
      default: {
        Individual
      }
    }
  },
  actionUpdateIndividual: {
    request: {
      contentType: 'application/json',
      body: {
        path: 'string*',
        individualId: 'string'
      }
    },
    response: {
      200: {
      },
      404: {
        errors: {
          IndividualNotFound
        }
      },
      contentType: 'application/json'
    },
    store: {
      default: {
        Individual
      }
    }
  },
  actionDeleteIndividual: {
    request: {
      contentType: 'application/json',
      params: {
        individualId: 'string*'
      }
    },
    response: {
      200: {
      },
      404: {
        errors: {
          IndividualNotFound
        }
      },
      contentType: 'application/json'
    },
    store: {
      default: {
        Individual, Clinical, Tissue
      }
    }
  },
};
