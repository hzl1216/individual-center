'use strict';

const multiparty = require('multiparty');
const fs = require('fs-extra');

class Multiparty {
  constructor(config) {
    this._config = config;
    this.createPath();
  }

  createPath() {
    if (Reflect.has(this._config, 'uploadDir')) {
      fs.ensureDirSync(this._config.uploadDir);
    }
  }

  parse(req) {
    return new Promise((resolve, reject) => {
      const form = new multiparty.Form(this._config);
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
        }
        const result = {
          fields,
          files
        };

        resolve(result);
      });
    });
  }
}

module.exports = Multiparty;
