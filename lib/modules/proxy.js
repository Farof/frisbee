var
  url = require('url'),
  http = require('http'),
  utils = require('../utils');

module.exports = function (path) {
  var reg = new RegExp(path);

  return function (req, res) {
    var target, data, u = url.parse(req.url, true);

    if (!res.finished && reg.test(u.pathname)) {
      target = u.query.url ? url.parse(u.query.url) : null;

      if (target && target.href) {
        http.get(target, function (r) {
          r.on('data', function (chunk) {
            data = data ? (data + chunk) : chunk;
          }).on('end', function () {
            console.log('proxy url: ', target.href);
            this.end(req, res,
                     200, { 'Content-Type': r.headers['content-type'],
                            'Content-Length': r.headers['content-length'] },
                     data);
          }.bind(this));
        }.bind(this));
      } else {
        this.end(req, res, 200, { 'Content-Type': utils.mimeMap.text }, 'invalid url: ' + req.url);
      }
    } else {
      this.next();
    }
  };
};
