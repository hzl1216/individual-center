'use strict';
const {
  PhosphoProtein,Rna,Wes,Protein,Tissue
} = require('../models/index');
const {
  DataNotFound, DataExist, TissueNotFound
} = require('../config/errors');

module.exports = {
  actionCreateData: {
    request: {
      contentType: 'application/json',
      body: {
        tissueId: 'string*',
        id: 'string*',
        type: 'string*',
        rawurl: 'string*',
        url: 'string*'
      }
    },
    response: {
      200: {
      },
      404: {
        errors: {
          DataNotFound, TissueNotFound
        }
      },
      403: {
        errors: {
          DataExist
        }
      },
      contentType: 'application/json'
    },
    store: {
      default: {
        PhosphoProtein,Rna,Wes,Protein,Tissue
      }
    }
  },
  actionGetDatas: {
    request: {
      contentType: 'application/json',
      query: {
        type: 'string*',
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
        data: [
          {
            objectId: 'string*',
            url: 'string*',
            rawurl: 'string*'
          }
        ]
      },
      contentType: 'application/json'
    },
    store: {
      default: {
        PhosphoProtein,Rna,Wes,Protein,Tissue
      }
    }
  },
  actionGetData: {
    request: {
      contentType: 'application/json',
      query: {
        type: 'string*',
      },
      params: {
        id: 'string*',
      },
    },
    response: {
      200: {
      },
      404: {
        errors: {
          DataNotFound
        }
      },
      contentType: 'application/json'
    },
    store: {
      default: {
        PhosphoProtein,Rna,Wes,Protein,Tissue
      }
    }
  },
};
