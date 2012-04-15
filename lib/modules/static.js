var
  url = require('url'),
  fs = require('fs'),
  utils = require('../utils');

var cache = {

};

module.exports = function (options) {
  var
    folder = options.folder,
    useCache = !!options.cache,
    expires = options.expires || 0;
  return function (req, res) {
    var u, targetPath, ext, end, cached, end, stat, mtime, lastMod;

    if (!res.finished) {
      u = url.parse(req.url);
      targetPath = folder + (u.pathname === '/' ? '/index.html' : u.pathname);

      // if http cache is enable
      if (expires) {
        mtime = (stat = fs.statSync(targetPath)) ? new Date(stat.mtime).getTime() : null;
        // if file exists
        if (mtime) {
          lastMod = (new Date(req.headers['if-modified-since'])).getTime();
          if (!isNaN(lastMod) && (mtime <= lastMod)) {
            return this.notModified(req, res);
          }
        }
      }

      ext = targetPath.split('.');
      ext = ext[ext.length - 1];

      end = function (data) {
        this.found(req, res, data, { 'Content-Type': utils.mimeMap[ext] || utils.mimeMap.text });
      }.bind(this);

      if (useCache && (cached = cache[targetPath]) && (!expires || (mtime <= lastMod))) {
        end(cached);
        return;
      }

      fs.readFile(targetPath, function (err, data) {
        if (err) {
          return this.next();
        }

        if (useCache) {
          cache[targetPath] = data;
        }

        if (expires) {
          res.setHeader('Expires', new Date(Date.now() + expires).toString());
          res.setHeader('Last-Modified', new Date(mtime).toString());
        }
        end(data);
      }.bind(this));
    } else {
      this.next();
    }
  };
};
