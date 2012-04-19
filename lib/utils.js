function log(req, msg) {
  var addr = req.socket.address();
  console.log(['[' + new Date() + ']', msg, '->', addr.address + ':' + addr.port, req.method, 'http://' + req.headers.host + req.url].join(' '));
}

exports.context = {
  notFound: function (req, res) {
    log(req, '404 not found');
    this.end(req, res, 404, 'Erreur 404, page non trouvée : ' + req.url, { 'Content-Type': 'text/plain' });
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
