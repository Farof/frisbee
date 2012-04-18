var mimeMap = exports.mimeMap = {
  html: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
  txt: 'text/plain'
};

function log(req, msg) {
  console.log(['[' + new Date() + ']', msg, '->', req.method, 'http://' + req.headers.host + req.url].join(' '));
}

exports.context = {
  notFound: function (req, res) {
    log(req, '404 not found');
    this.end(req, res, 404, 'Erreur 404, page non trouvée : ' + req.url, { 'Content-Type': mimeMap.txt });
  },

  notModified: function (req, res) {
    log(req , '304 not modified');
    this.end(req, res, 304);
  },

  found: function (req, res, data, headers) {
    log(req, '200 found');
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
