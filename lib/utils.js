
exports.context = {
  // 404
  notFound: function (req, res) {
    this.end(req, res, 404, 'Erreur 404, page non trouvée : ' + req.url, { 'Content-Type': 'text/plain' });
  },

  // 403
  forbiden: function (req, res) {
    this.end(req, res, 403, 'Forbiden');
  },

  // 304
  notModified: function (req, res) {
    this.end(req, res, 304);
  },

  // 301
  redirect: function (req, res, url) {
    this.end(req, res, 301, 'Redirecting to ', { Location: url });
  },

  // 200
  found: function (req, res, data, headers) {
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
      res.setHeader('Content-Length', data.length);
      res.write(data);
    }
    this.next();
  }
};
