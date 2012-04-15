
var mimeMap = exports.mimeMap = {
  html: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
  txt: 'text/plain'
};

exports.context = {
  notFound: function (req, res) {
    if (!res.finished) {
      console.log('404 not found: ', req.url);
      this.end(req, res, 404, { 'Content-Type': mimeMap.txt }, 'Erreur 404, page non trouvée : ' + req.url);
    }
  },

  notModified: function (req, res) {
    if (!res.finished) {
      console.log('304 not modified: ', req.url);
      this.end(req, res, 304, {});
    }
  },

  found: function (req, res, data, headers) {
    if (!res.finished) {
      console.log('200 found: ', req.url);
      this.end(req, res, 200, headers || {}, data);
    }
  },

  end: function (req, res, code, headers, data) {
    res.writeHead(code, headers);
    res.end(data);
  }
};
