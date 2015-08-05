'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = makeDriver;
exports.pathContext = pathContext;
exports.contextify = contextify;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _rx = require('rx');

var _rx2 = _interopRequireDefault(_rx);

var _pathToRegexp = require('path-to-regexp');

var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

var _lodash = require('lodash');

//routes -> route$ -> context$

function makeDriver(routes) {
  return function (route$) {
    var popStateSubject = _rx2['default'].Observable.create(function (observer) {
      window.onpopstate = function popstateCallback() {
        observer.onNext(pathContext(window.location.pathname, routes));
      };
    });

    return route$.map(function (route) {
      var context = contextify(route, routes);
      window.history.pushState(context, context.name, context.path);
      return context;
    }).merge(popStateSubject).startWith(pathContext(window.location.pathname, routes));
  };
}

//path -> routes -> context

function pathContext(path, routes) {
  var matchedRoute = (0, _lodash.map)(routes, function (route) {
    var keys = [];
    var _re = (0, _pathToRegexp2['default'])(route.path, keys);
    var re = _re.exec(path);
    if (re === null) {
      return null;
    }

    return {
      name: route.name,
      path: path,
      params: (0, _lodash.zipObject)((0, _lodash.map)(keys, function (key) {
        return key.name;
      }), re.splice(1))
    };
  });

  return (0, _lodash.find)(matchedRoute, function (val) {
    return val;
  });
}

//route -> routes -> context

function contextify(route, routes) {
  var name = route[0];
  var params = route[1];
  var path = (0, _lodash.find)(routes, function (r) {
    return r.name == name;
  }).path;

  return {
    name: name,
    path: _pathToRegexp2['default'].compile(path)(params),
    params: params
  };
}
