'use strict';

const {
  UserNotFound, NameExist, PasswordError
} = require('../config/errors');

const {
  User,Session
} = require('../models/index')
module.exports = {
  actionCreateUser: {
    request: {
      contentType: 'application/json',
      body: {
        loginName: 'string*',
        password: 'string*'
      }
    },
    response: {
      200: {
      },
      403: {
        errors: {
          NameExist
        } 
      },
      contentType: 'application/json'
    },
    store: {
      default:{User}
    }
  },
  actionGetUsers: {
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
      default:{User}
    },
    permission: 'login'
  },
  actionGetUser: {
    request: {
      contentType: 'application/json',
      params: {
        loginName: 'string*'
      }
    },
    response: {
      200: {
      },
      404: {
        errors: {
          UserNotFound
        }
      },
      contentType: 'application/json'
    },
    store: {
      default:{User}
    }
  },
  actionLogin: {
    request: {
      contentType: 'application/json',
        body: {
          loginName: 'string*',
          password: 'string*'
        }
    },
    response: {
      200: {
      },
      404: {
        errors: {
          UserNotFound,
        }
      },
      403: {
        errors: {
          PasswordError,
        }
      },
      contentType: 'application/json'
    },
    store: {
      default:{User, Session}
    },
  },
  actionLogout: {
    request: {
      contentType: 'application/json',
    },
    response: {
      200: {
      },
      404: {
        errors: {
          UserNotFound,
        }
      },
      contentType: 'application/json'
    },
    store: {
      default:{User, Session}
    },
  },
};
