'use strict';

module.exports = {
  name: 'individual-center',
  version: '1.0.0-alpha.1',
  description: 'Description',
  basePath: '/individual-center/v1',
  apps: {
    account: require('./account'),
    object: require('./object')
  }
};
