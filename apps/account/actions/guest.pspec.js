'use strict';

const {
  GuestNotFound, NameExist, PasswordError, OverTime, CodeError
} = require('../config/errors');

const {
  Guest,Session,Information
} = require('../models/index')
module.exports = {
  actionCreateGuest: {
    request: {
      contentType: 'application/json',
      body: {
        loginName: 'string*',
        email: 'string*'
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
      default:{Guest}
    }
  },

  actionUpdateGuest: {
    request: {
      contentType: 'application/json',
      body: {
        loginName: 'string*',
        email: 'string*',
        password: 'string*',
        code: 'string*'
      }
    },
    response: {
      200: {
      },
      404: {
        errors: {
          GuestNotFound
        }
      },
      403: {
        errors: {
          OverTime,
          CodeError
        } 
      },
      contentType: 'application/json'
    },
    store: {
      default:{Guest}
    }
  },

  actionUpdateInformation: {
    request: {
      contentType: 'application/json',
      body: {
        loginName: 'string*',
        name: 'string*',
        orgnization: 'string*',
        title: 'string*',
        phone: 'string*'
      }
    },
    response: {
      200: {
      },
      404: {
        errors: {
          GuestNotFound
        }
      },
  
      contentType: 'application/json'
    },
    store: {
      default:{Guest,Information}
    }
  },
    



  actionGetGuests: {
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
      default:{Guest}
    },
    permission: 'login'
  },
  actionGetGuest: {
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
          GuestNotFound
        }
      },
      contentType: 'application/json'
    },
    store: {
      default:{Guest}
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
          GuestNotFound,
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
      default:{Guest, Session}
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
          GuestNotFound,
        }
      },
      contentType: 'application/json'
    },
    store: {
      default:{Guest, Session}
    },
  },
};
