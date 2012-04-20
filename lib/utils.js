
exports.context = {
  notFound: function (req, res) {
    this.end(req, res, 404, 'Erreur 404, page non trouvée : ' + req.url, { 'Content-Type': 'text/plain' });
  },

  notModified: function (req, res) {
    this.end(req, res, 304);
  },

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
      res.write(data);
    }
    this.next();
  }
};
