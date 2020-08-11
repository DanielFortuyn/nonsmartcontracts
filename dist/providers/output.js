"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _handlebars = _interopRequireDefault(require("handlebars"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _marked = _interopRequireDefault(require("marked"));

var _md = _interopRequireDefault(require("md5"));

var _pubsubJs = _interopRequireDefault(require("pubsub-js"));

var _data = _interopRequireDefault(require("./data.js"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _wrapAsyncGenerator(fn) { return function () { return new _AsyncGenerator(fn.apply(this, arguments)); }; }

function _AsyncGenerator(gen) { var front, back; function send(key, arg) { return new Promise(function (resolve, reject) { var request = { key: key, arg: arg, resolve: resolve, reject: reject, next: null }; if (back) { back = back.next = request; } else { front = back = request; resume(key, arg); } }); } function resume(key, arg) { try { var result = gen[key](arg); var value = result.value; var wrappedAwait = value instanceof _AwaitValue; Promise.resolve(wrappedAwait ? value.wrapped : value).then(function (arg) { if (wrappedAwait) { resume(key === "return" ? "return" : "next", arg); return; } settle(result.done ? "return" : "normal", arg); }, function (err) { resume("throw", err); }); } catch (err) { settle("throw", err); } } function settle(type, value) { switch (type) { case "return": front.resolve({ value: value, done: true }); break; case "throw": front.reject(value); break; default: front.resolve({ value: value, done: false }); break; } front = front.next; if (front) { resume(front.key, front.arg); } else { back = null; } } this._invoke = send; if (typeof gen["return"] !== "function") { this["return"] = undefined; } }

if (typeof Symbol === "function" && Symbol.asyncIterator) { _AsyncGenerator.prototype[Symbol.asyncIterator] = function () { return this; }; }

_AsyncGenerator.prototype.next = function (arg) { return this._invoke("next", arg); };

_AsyncGenerator.prototype["throw"] = function (arg) { return this._invoke("throw", arg); };

_AsyncGenerator.prototype["return"] = function (arg) { return this._invoke("return", arg); };

function _awaitAsyncGenerator(value) { return new _AwaitValue(value); }

function _AwaitValue(value) { this.wrapped = value; }

function _asyncGeneratorDelegate(inner, awaitWrap) { var iter = {}, waiting = false; function pump(key, value) { waiting = true; value = new Promise(function (resolve) { resolve(inner[key](value)); }); return { done: false, value: awaitWrap(value) }; } ; if (typeof Symbol === "function" && Symbol.iterator) { iter[Symbol.iterator] = function () { return this; }; } iter.next = function (value) { if (waiting) { waiting = false; return value; } return pump("next", value); }; if (typeof inner["throw"] === "function") { iter["throw"] = function (value) { if (waiting) { waiting = false; throw value; } return pump("throw", value); }; } if (typeof inner["return"] === "function") { iter["return"] = function (value) { if (waiting) { waiting = false; return value; } return pump("return", value); }; } return iter; }

function _asyncIterator(iterable) { var method; if (typeof Symbol !== "undefined") { if (Symbol.asyncIterator) { method = iterable[Symbol.asyncIterator]; if (method != null) return method.call(iterable); } if (Symbol.iterator) { method = iterable[Symbol.iterator]; if (method != null) return method.call(iterable); } } throw new TypeError("Object is not async iterable"); }

_dotenv["default"].config();

var e = process.env;
var splittert = e.SPLITTER;

var Output = /*#__PURE__*/function () {
  function Output(template) {
    _classCallCheck(this, Output);

    this.partials = {};
    this.dataProvider = new _data["default"]();
    this.registerHelpers();
  }

  _createClass(Output, [{
    key: "loadTemplate",
    value: function () {
      var _loadTemplate = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(template) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.registerPartials();

              case 2:
                this.registerHelpers();

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function loadTemplate(_x2) {
        return _loadTemplate.apply(this, arguments);
      }

      return loadTemplate;
    }()
  }, {
    key: "registerHelpers",
    value: function registerHelpers() {
      var article = 1;
      var subcount = 1;

      _handlebars["default"].registerHelper('count', function (count) {
        subcount = 1;
        return article++;
      });

      _handlebars["default"].registerHelper('subcount', function (count) {
        return subcount++;
      });
    }
  }, {
    key: "walk",
    value: function (_walk) {
      function walk(_x) {
        return _walk.apply(this, arguments);
      }

      walk.toString = function () {
        return _walk.toString();
      };

      return walk;
    }(function (dir) {
      return _wrapAsyncGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, d, entry;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _context2.prev = 2;
                _context2.t0 = _asyncIterator;
                _context2.next = 6;
                return _awaitAsyncGenerator(_fs["default"].promises.opendir(dir));

              case 6:
                _context2.t1 = _context2.sent;
                _iterator = (0, _context2.t0)(_context2.t1);

              case 8:
                _context2.next = 10;
                return _awaitAsyncGenerator(_iterator.next());

              case 10:
                _step = _context2.sent;
                _iteratorNormalCompletion = _step.done;
                _context2.next = 14;
                return _awaitAsyncGenerator(_step.value);

              case 14:
                _value = _context2.sent;

                if (_iteratorNormalCompletion) {
                  _context2.next = 35;
                  break;
                }

                d = _value;
                entry = _path["default"].join(dir, d.name);

                if (!d.isDirectory()) {
                  _context2.next = 29;
                  break;
                }

                _context2.t2 = _asyncGeneratorDelegate;
                _context2.t3 = _asyncIterator;
                _context2.next = 23;
                return _awaitAsyncGenerator(walk(entry));

              case 23:
                _context2.t4 = _context2.sent;
                _context2.t5 = (0, _context2.t3)(_context2.t4);
                _context2.t6 = _awaitAsyncGenerator;
                return _context2.delegateYield((0, _context2.t2)(_context2.t5, _context2.t6), "t7", 27);

              case 27:
                _context2.next = 32;
                break;

              case 29:
                if (!d.isFile()) {
                  _context2.next = 32;
                  break;
                }

                _context2.next = 32;
                return entry;

              case 32:
                _iteratorNormalCompletion = true;
                _context2.next = 8;
                break;

              case 35:
                _context2.next = 41;
                break;

              case 37:
                _context2.prev = 37;
                _context2.t8 = _context2["catch"](2);
                _didIteratorError = true;
                _iteratorError = _context2.t8;

              case 41:
                _context2.prev = 41;
                _context2.prev = 42;

                if (!(!_iteratorNormalCompletion && _iterator["return"] != null)) {
                  _context2.next = 46;
                  break;
                }

                _context2.next = 46;
                return _awaitAsyncGenerator(_iterator["return"]());

              case 46:
                _context2.prev = 46;

                if (!_didIteratorError) {
                  _context2.next = 49;
                  break;
                }

                throw _iteratorError;

              case 49:
                return _context2.finish(46);

              case 50:
                return _context2.finish(41);

              case 51:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[2, 37, 41, 51], [42,, 46, 50]]);
      }))();
    })
  }, {
    key: "parseFile",
    value: function () {
      var _parseFile = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(name, p) {
        var file, parts;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                file = _fs["default"].readFileSync(p, 'utf8');
                parts = file.split(splittert);

                if (!(parts.length == 3)) {
                  _context3.next = 7;
                  break;
                }

                _context3.next = 5;
                return this.dataProvider.fixData(parts[1]);

              case 5:
                this.partials[name] = _context3.sent;
                return _context3.abrupt("return", parts[2]);

              case 7:
                return _context3.abrupt("return", file);

              case 8:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function parseFile(_x3, _x4) {
        return _parseFile.apply(this, arguments);
      }

      return parseFile;
    }()
  }, {
    key: "compile",
    value: function compile(data) {
      console.log(_typeof(data.agreementText));

      var compiled = _handlebars["default"].compile(data.agreementText); // compiled(data.data);
      // for (var name in Handlebars.partials) {
      //     var partial = Handlebars.partials[name]
      //     if (typeof partial === 'function') {
      //         // add these questions
      //       console.log('Using partial' + name);
      //       console.log("DATA", this.partials[name]);
      //     } else {
      //         console.log('Not using ' + name);
      //     }
      // }
      // console.log(compiled(data.data))


      console.log(_typeof(data.data));
      return compiled(data.data);
    }
  }, {
    key: "getFileName",
    value: function getFileName(data) {
      return (0, _md["default"])(JSON.stringify(data.data));
    }
  }, {
    key: "compileHtml",
    value: function () {
      var _compileHtml = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(userId, data) {
        var filename, template, output;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.getFileName(data);

              case 2:
                _context4.t0 = _context4.sent;
                filename = _context4.t0 + '.html';
                _context4.next = 6;
                return this.compile(data);

              case 6:
                template = _context4.sent;
                _context4.next = 9;
                return this.mergeFiles(template, data.data);

              case 9:
                output = _context4.sent;

                _fs["default"].writeFileSync('output/' + filename, output);

                return _context4.abrupt("return", filename);

              case 12:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function compileHtml(_x5, _x6) {
        return _compileHtml.apply(this, arguments);
      }

      return compileHtml;
    }()
  }, {
    key: "compileMd",
    value: function compileMd(userId, data) {
      var filename = this.getFileName(data) + '.md';
      var markdown = this.compile(data);

      _fs["default"].writeFileSync('output/' + filename, markdown);

      return filename;
    }
  }, {
    key: "mergeFiles",
    value: function mergeFiles(markdown, data) {
      var pre = _handlebars["default"].compile(_fs["default"].readFileSync('templates/pre.handlebars', 'utf8'));

      var post = _handlebars["default"].compile(_fs["default"].readFileSync('templates/post.handlebars', 'utf8'));

      return pre(data) + (0, _marked["default"])(markdown) + post(data);
    }
  }, {
    key: "registerPartials",
    value: function () {
      var _registerPartials = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        var partialPath, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _value2, p, name, parse;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                partialPath = 'partials/';
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _context5.prev = 3;
                _iterator2 = _asyncIterator(this.walk(partialPath));

              case 5:
                _context5.next = 7;
                return _iterator2.next();

              case 7:
                _step2 = _context5.sent;
                _iteratorNormalCompletion2 = _step2.done;
                _context5.next = 11;
                return _step2.value;

              case 11:
                _value2 = _context5.sent;

                if (_iteratorNormalCompletion2) {
                  _context5.next = 24;
                  break;
                }

                p = _value2;
                name = p.replace(partialPath, '').replace('.partial', '');
                _context5.next = 17;
                return this.parseFile(name, p);

              case 17:
                parse = _context5.sent;
                console.log(_typeof(parse));
                console.log(parse);

                _handlebars["default"].registerPartial(name, parse);

              case 21:
                _iteratorNormalCompletion2 = true;
                _context5.next = 5;
                break;

              case 24:
                _context5.next = 30;
                break;

              case 26:
                _context5.prev = 26;
                _context5.t0 = _context5["catch"](3);
                _didIteratorError2 = true;
                _iteratorError2 = _context5.t0;

              case 30:
                _context5.prev = 30;
                _context5.prev = 31;

                if (!(!_iteratorNormalCompletion2 && _iterator2["return"] != null)) {
                  _context5.next = 35;
                  break;
                }

                _context5.next = 35;
                return _iterator2["return"]();

              case 35:
                _context5.prev = 35;

                if (!_didIteratorError2) {
                  _context5.next = 38;
                  break;
                }

                throw _iteratorError2;

              case 38:
                return _context5.finish(35);

              case 39:
                return _context5.finish(30);

              case 40:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[3, 26, 30, 40], [31,, 35, 39]]);
      }));

      function registerPartials() {
        return _registerPartials.apply(this, arguments);
      }

      return registerPartials;
    }()
  }]);

  return Output;
}();

var _default = Output;
exports["default"] = _default;