var
  url = require('url'),
  fs = require('fs'),
  utils = require('../utils');

module.exports = function (staticFolder) {
  return function (req, res) {
    var u, targetPath, ext;
    console.log('static: ', req.url);
    if (!res.finished) {
      u = url.parse(req.url);
      targetPath = staticFolder + (u.pathname === '/' ? '/index.html' : u.pathname);

      ext = targetPath.split('.');
      ext = ext[ext.length - 1];

      fs.readFile(targetPath, function (err, data) {
        if (err) {
          console.log('not a static file: ', u.pathname);
          this.next();
          return;
        }

        this.end(req, res, 200, { 'Content-Type': utils.mimeMap[ext] || 'text/plain' }, data);
      }.bind(this));
    } else {
      this.next();
    }
  };
};
