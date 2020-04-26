'use strict';

class Session {
  constructor(req) {
    this._req = req;
  }

  destroyStore(id) {
    return new Promise((resolve, reject) => {
      this._req.sessionStore.destroy(id, err => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  destroy() {
    return new Promise((resolve, reject) => {
      this._req.session.destroy(err => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }
}

module.exports = Session;