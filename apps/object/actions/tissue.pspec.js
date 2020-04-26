'use strict';

const {
  TissueNotFound, IndividualNotFound, TissueExist
} = require('../config/errors');
const {
  Individual, Tissue
} = require('../models/index');
module.exports = {
  actionCreateTissue: {
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
          IndividualNotFound
        }
      },
      403: {
        errors: {
          TissueExist
        }
      },
      contentType: 'application/json'
    },
    store: {
      default: {
        Tissue,
        Individual
      }
    }
  },
  actionGetTissues: {
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
        Tissue
      }
    }
  },
  actionGetTissue: {
    request: {
      contentType: 'application/json',
      params: {
        tissueId: 'string*'
      }
    },
    response: {
      200: {
      },
      404: {
        errors: {
          TissueNotFound
        }
      },
      contentType: 'application/json'
    },
    store: {
      default: {
        Tissue
      }
    }
  },
  actionUpdateTissue: {
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
          TissueNotFound
        }
      },
      contentType: 'application/json'
    },
    store: {
      default: {
        Tissue
      }
    }
  },
  actionDeleteTissue: {
    request: {
      contentType: 'application/json',
      params: {
        tissueId: 'string*'
      }
    },
    response: {
      200: {
      },
      404: {
        errors: {
          TissueNotFound,
          IndividualNotFound
        }
      },
      contentType: 'application/json'
    },
    store: {
      default: {
        Tissue, Individual      }
    }
  },
};
