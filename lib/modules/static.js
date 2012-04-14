var
  url = require('url'),
  fs = require('fs'),
  utils = require('../utils');

var cache = {

};

module.exports = function (options) {
  var
    folder = options.folder,
    useCache = !!options.cache;
  return function (req, res) {
    var u, targetPath, ext, end, cached;

    if (!res.finished) {
      u = url.parse(req.url);
      targetPath = folder + (u.pathname === '/' ? '/index.html' : u.pathname);

      ext = targetPath.split('.');
      ext = ext[ext.length - 1];

      if (useCache && (cached = cache[targetPath])) {
        console.log('serve cache: ', targetPath);
        this.end(req, res, 200, { 'Content-Type': utils.mimeMap[ext] || 'text/plain' }, cached);
        return;
      }

      fs.readFile(targetPath, function (err, data) {
        if (err) {
          console.log('not a static file: ', u.pathname);
          this.next();
          return;
        }

        if (useCache) {
          cache[targetPath] = data;
        }

        console.log('static: ', req.url);
        this.end(req, res, 200, { 'Content-Type': utils.mimeMap[ext] || 'text/plain' }, data);
      }.bind(this));
    } else {
      this.next();
    }
  };
};
