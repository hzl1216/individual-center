'use strict';

module.exports = {
  InternalException: {
    id: 1,
    message: 'Server internal exception',
    status: 500,
  },
  FieldsError: {
    id: 101,
    message: 'The format of fields is incorrect.',
  },
  NoLoginError: {
    id: 102,
    message: 'You are not yet logged in.',
    status: 401
  },
  PermissionError: {
    id: 103,
    message: 'You have no access to this resource.',
    status: 403
  }
};
