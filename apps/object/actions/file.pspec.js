'use strict';

const {
  FileNotFound,PrivilegeLimited,UploadFailed
} = require('../config/errors');
module.exports = {
  actionUpload: {
    request: {
      contentType:  'application/json',
      file: 'string*'
    },
    response: {
      200: {
      },
      403: {
        errors: {
          UploadFailed
        }
      },
      contentType: 'application/json'
    },
    store: {
      default: [
      ]
    },
    permission: 'login'
  },
  actionDownload: {
    request: {
      contentType: 'application/json',
      query: {
        path: 'string*'
      }
    },
    response: {
      200: {
      },
      404: {
        errors: {
          FileNotFound,
        }
      },
      403: {
        errors: {
          PrivilegeLimited
        }
      },
      contentType: 'application/json'
    },
    store: {
      default: [
      ]
    },
    permission: 'login'
  }
};
