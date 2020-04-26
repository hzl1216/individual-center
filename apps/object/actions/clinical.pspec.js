'use strict';

const {
  ClinicalNotFound, IndividualNotFound, ClinicalExist
} = require('../config/errors');
const {
   Clinical, Individual
} = require('../models/index')
module.exports = {
  actionCreateClinical: {
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
      403: {
        errors: {
          ClinicalExist
        }
      },
      contentType: 'application/json'
    },
    store: {
      default: {
        Clinical, Individual
      }
    }
  },
  actionGetClinicals: {
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
        Clinical
      }
    }
  },
  actionGetClinical: {
    request: {
      contentType: 'application/json',
      params: {
        clinicalId: 'string*'
      }
    },
    response: {
      200: {
      },
      404: {
        errors: {
          ClinicalNotFound
        }
      },
      contentType: 'application/json'
    },
    store: {
      default: {
        Clinical
      }
    }
  },
  actionUpdateClinical: {
    request: {
      contentType: 'application/json',
      body: {
        path: 'string*',
      }
    },
    response: {
      200: {
      },
      404: {
        errors: {
          ClinicalNotFound
        }
      },
      contentType: 'application/json'
    },
    store: {
      default: {
        Clinical
      }
    }
  },
  actionDeleteClinical: {
    request: {
      contentType: 'application/json',
      params: {
        clinicalId: 'string*'
      }
    },
    response: {
      200: {
      },
      404: {
        errors: {
          ClinicalNotFound,
          IndividualNotFound
        }
      },
      contentType: 'application/json'
    },
    store: {
      default: {
        Clinical, Individual
      }
    }
  },
};
