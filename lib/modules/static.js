const
  url = require('url'),
  fs = require('fs'),
  mime = require('../mime');

module.exports = function (options) {
  var
    folder = options.folder,
    redirect = !!options.redirect;

  return function (req, res) {
    var u, targetPath, end, cached, end, lastMod;

    if (!res.finished) {
      // parse url
      u = url.parse(req.url);
      // static folder relative path
      targetPath = folder + u.pathname

      // if path is a folder, look for index.html
      if (u.pathname[u.pathname.length - 1] === '/') {
        targetPath += 'index.html'
      }

      // if path contains a hidden file or folder, forbid access
      if ((/\/\./).test(u.pathname)) {
        return this.forbiden(req, res);
      }

      fs.stat(targetPath, function (err, stat) {
        if (err) {
          console.log('error: ', err);
          return this.next();
        }

        // if file is directory, redirect
        if (redirect && stat.isDirectory()) {
          return this.redirect(req, res, req.url + '/');
        }

        // if not modified, don't serve content
        lastMod = (new Date(req.headers['if-modified-since'])).getTime();
        if (!isNaN(lastMod) && (stat.mtime <= lastMod)) {
          return this.notModified(req, res);
        }

        res.setHeader('Last-Modified', stat.mtime.toUTCString());

        fs.readFile(targetPath, function (err, data) {
          if (err) {
            return this.next();
          }

          res.setHeader('Content-Type', mime.lookup(targetPath));
          return this.found(req, res, data);
        }.bind(this));
      }.bind(this));
    } else {
      this.next();
    }
  };
};
