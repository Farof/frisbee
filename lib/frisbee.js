var
  fs = require('fs'),
  utils = require('./utils'),
  path = require('path'),
  basename = path.basename;

exports = module.exports = function() {
  var
    middlewares = [],
    app = function (req, res) {
      next.call(utils.context, middlewares, 0, req, res);
    },
    use = function (middleware) {
      middlewares.push(middleware);
      return app;
    };

  app.use = use;
  return app;
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
