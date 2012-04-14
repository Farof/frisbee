var
  http = require('http'),
  fs = require('fs'),
  utils = require('./utils'),
  path = require('path'),
  basename = path.basename;

var serv = exports = module.exports = function() {
  var
    instance,
    middlewares = [],
    routes = [],
    ret = {
      use: function (middleware) {
        middlewares.push(middleware);
        return ret;
      },

      listen: function (port) {
        instance = http.createServer(function (req, res) {
          next.call(utils.context, middlewares, 0, req, res);
        });
        instance.listen(port);
        return instance;
      }
    };
  return ret;
};

function next(middlewares, index, req, res) {
  var middleware = middlewares[index];
  if (middleware) {
    middleware.call(Object.create(this, {
      next: {
        value: function () {
          next.call(utils.context, middlewares, ++index, req, res);
        }
      }
    }), req, res);
  } else {
    this.notFound(req, res);
  }
}

fs.readdirSync(__dirname + '/modules').forEach(function (filename) {
  var name;
  if (/\.js$/.test(filename)) {
    name = basename(filename, '.js');
    exports.__defineGetter__(name, function () {
      return require('./modules/' + name);
    });
  }
});
