
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

  end: function (req, res, code, headers, data) {
    res.writeHead(code, headers);
    res.end(data);
  }
};
