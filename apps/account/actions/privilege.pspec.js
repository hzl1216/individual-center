'use strict';

const {
  PrivilegeNotFound, PrivilegeExist
} = require('../config/errors');
const {
  User,Privilege
} = require('../models/index')
module.exports = {
  actionCreatePrivilege: {
    request: {
      contentType: 'application/json',
      body: {
        name: 'string*',
        description: 'string*'
      }
    },
    response: {
      200: {
      },
      403: {
        errors: {
          PrivilegeExist
        } 
      },
      contentType: 'application/json'
    },
    store: {
      default: {Privilege
      }
    }
  },
  actionGetPrivileges: {
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
      404: {
        errors: {
          PrivilegeNotFound
        }
      },
      contentType: 'application/json'
    },
    store: {
      default: {Privilege
      }
    }
  },
  actionGetPrivilege: {
    request: {
      contentType: 'application/json',
      params: {
        pId: 'string*'
      }
    },
    response: {
      200: {
      },
      404: {
        errors: {
          PrivilegeNotFound
        }
      },
      contentType: 'application/json'
    },
    store: {
      default: {Privilege
      }
    }
  },
  
};
