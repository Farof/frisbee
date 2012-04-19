const
  url = require('url'),
  fs = require('fs'),
  mime = require('../mime');

var cache = {

};

module.exports = function (options) {
  var
    folder = options.folder,
    useCache = !!options.cache,
    expires = options.expires || 0;
  return function (req, res) {
    var u, targetPath, end, cached, end, mtime, lastMod;

    if (!res.finished) {
      u = url.parse(req.url);
      targetPath = folder + u.pathname + (u.pathname[u.pathname.length - 1] === '/' ? 'index.html' : '');

      // if http cache is enable
      if (expires) {
        try {
          mtime = new Date(fs.statSync(targetPath).mtime).getTime();
          // if file exists
          lastMod = (new Date(req.headers['if-modified-since'])).getTime();
          if (!isNaN(lastMod) && (mtime <= lastMod)) {
            return this.notModified(req, res);
          }
        } catch (e) {
          return this.notFound(req, res);
        }
      }

      end = function (data) {
        this.found(req, res, data, { 'Content-Type': mime.lookup(targetPath) || 'text/plain' });
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
