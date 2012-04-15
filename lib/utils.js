var mimeMap = exports.mimeMap = {
  html: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
  txt: 'text/plain'
};

exports.context = {
  notFound: function (req, res) {
    console.log('404 not found: ', req.url);
    this.end(req, res, 404, 'Erreur 404, page non trouvée : ' + req.url, { 'Content-Type': mimeMap.txt });
  },

  notModified: function (req, res) {
    console.log('304 not modified: ', req.url);
    this.end(req, res, 304);
  },

  found: function (req, res, data, headers) {
    console.log('200 found: ', req.url);
    this.end(req, res, 200, data, headers);
  },

  end: function (req, res, code, data, headers) {
    var key;
    headers = headers || {};
    for (key in headers) {
      res.setHeader(key, headers[key]);
    }
    res.statusCode = code;
    if (data) {
      res.write(data);
    }
    this.next();
  }
};
