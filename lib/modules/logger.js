const codeMap = {
  200: '200 found',
  304: '304 not modified',
  404: '404 not found'
};

const formats = {
  normal: '[{date}] {code} -> {addr}:{port} {method} {url}'
};

module.exports = function (options) {
  options = options || {};

  const format = (typeof options.format === 'string') ? (formats[options.format] || options.format) : formats.normal;

  return function (req, res) {
    var end = res.end, addr = req.socket.address();

    res.end = function () {
      console.log(format.replace('{date}', new Date(), 'g')
                        .replace('{code}', codeMap[res.statusCode], 'g')
                        .replace('{addr}', addr.address, 'g')
                        .replace('{port}', addr.port)
                        .replace('{method}', req.method)
                        .replace('{url}', 'http://' + req.headers.host + req.url));
      return end.apply(res, arguments);
    };

    this.next();
  };
};
