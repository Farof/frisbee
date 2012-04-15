var
  fs = require('fs'),
  utils = require('./utils'),
  path = require('path'),
  basename = path.basename;

exports = module.exports = function() {
  var
    middlewares = [],
    app = function (req, res) {
      use(endRequest.bind(utils.context));
      next.call(utils.context, req, res, middlewares, 0);
    },
    use = function (middleware) {
      middlewares.push(middleware);
      return app;
    };

  app.use = use;
  return app;
};

function next(req, res, middlewares, index) {
  var middleware = middlewares[index];
  if (middleware) {
    middleware.call(Object.create(this, {
      next: {
        value: function () {
          next.call(utils.context, req, res, middlewares, ++index);
        }
      }
    }), req, res);
  } else {
    this.notFound(req, res);
  }
}

function endRequest(req, res) {
  if (!res.finished) {
    res.end();
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
