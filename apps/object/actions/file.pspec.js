'use strict';

const {
  FileNotFound
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
      404: {
        errors: {
          FileNotFound
        }
      },
      contentType: 'application/json'
    },
    store: {
      default: [
      ]
    }
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
          FileNotFound
        }
      },
      contentType: 'application/json'
    },
    store: {
      default: [
      ]
    }
  }
};
