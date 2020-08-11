"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

var Agreement = /*#__PURE__*/function () {
  function Agreement(agreementPath) {
    _classCallCheck(this, Agreement);

    this.agreementPath = agreementPath || [];
    this.agreements = [];
    this.register();
  }

  _createClass(Agreement, [{
    key: "walk",
    value: function walk(dir) {
      var _this = this;

      return _wrapAsyncGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, d, entry;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _context.prev = 2;
                _context.t0 = _asyncIterator;
                _context.next = 6;
                return _awaitAsyncGenerator(_fs["default"].promises.opendir(dir));

              case 6:
                _context.t1 = _context.sent;
                _iterator = (0, _context.t0)(_context.t1);

              case 8:
                _context.next = 10;
                return _awaitAsyncGenerator(_iterator.next());

              case 10:
                _step = _context.sent;
                _iteratorNormalCompletion = _step.done;
                _context.next = 14;
                return _awaitAsyncGenerator(_step.value);

              case 14:
                _value = _context.sent;

                if (_iteratorNormalCompletion) {
                  _context.next = 35;
                  break;
                }

                d = _value;
                entry = _path["default"].join(dir, d.name);

                if (!d.isDirectory()) {
                  _context.next = 29;
                  break;
                }

                _context.t2 = _asyncGeneratorDelegate;
                _context.t3 = _asyncIterator;
                _context.next = 23;
                return _awaitAsyncGenerator(_this.walk(entry));

              case 23:
                _context.t4 = _context.sent;
                _context.t5 = (0, _context.t3)(_context.t4);
                _context.t6 = _awaitAsyncGenerator;
                return _context.delegateYield((0, _context.t2)(_context.t5, _context.t6), "t7", 27);

              case 27:
                _context.next = 32;
                break;

              case 29:
                if (!d.isFile()) {
                  _context.next = 32;
                  break;
                }

                _context.next = 32;
                return entry;

              case 32:
                _iteratorNormalCompletion = true;
                _context.next = 8;
                break;

              case 35:
                _context.next = 41;
                break;

              case 37:
                _context.prev = 37;
                _context.t8 = _context["catch"](2);
                _didIteratorError = true;
                _iteratorError = _context.t8;

              case 41:
                _context.prev = 41;
                _context.prev = 42;

                if (!(!_iteratorNormalCompletion && _iterator["return"] != null)) {
                  _context.next = 46;
                  break;
                }

                _context.next = 46;
                return _awaitAsyncGenerator(_iterator["return"]());

              case 46:
                _context.prev = 46;

                if (!_didIteratorError) {
                  _context.next = 49;
                  break;
                }

                throw _iteratorError;

              case 49:
                return _context.finish(46);

              case 50:
                return _context.finish(41);

              case 51:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[2, 37, 41, 51], [42,, 46, 50]]);
      }))();
    }
  }, {
    key: "register",
    value: function () {
      var _register = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _value2, p, shortName;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _context2.prev = 2;
                _iterator2 = _asyncIterator(this.walk(this.agreementPath));

              case 4:
                _context2.next = 6;
                return _iterator2.next();

              case 6:
                _step2 = _context2.sent;
                _iteratorNormalCompletion2 = _step2.done;
                _context2.next = 10;
                return _step2.value;

              case 10:
                _value2 = _context2.sent;

                if (_iteratorNormalCompletion2) {
                  _context2.next = 17;
                  break;
                }

                p = _value2;

                if (p.includes('.agreement')) {
                  shortName = p.replace('.agreement', '').replace(this.agreementPath, '');
                  this.agreements.push({
                    value: {
                      path: p,
                      name: p.replace('.agreement', '').replace(this.agreementPath, '').replace('/', '.')
                    },
                    name: shortName.replace('/', '.'),
                    key: shortName.split('/')[shortName.split('/').length - 1],
                    "short": p
                  });
                }

              case 14:
                _iteratorNormalCompletion2 = true;
                _context2.next = 4;
                break;

              case 17:
                _context2.next = 23;
                break;

              case 19:
                _context2.prev = 19;
                _context2.t0 = _context2["catch"](2);
                _didIteratorError2 = true;
                _iteratorError2 = _context2.t0;

              case 23:
                _context2.prev = 23;
                _context2.prev = 24;

                if (!(!_iteratorNormalCompletion2 && _iterator2["return"] != null)) {
                  _context2.next = 28;
                  break;
                }

                _context2.next = 28;
                return _iterator2["return"]();

              case 28:
                _context2.prev = 28;

                if (!_didIteratorError2) {
                  _context2.next = 31;
                  break;
                }

                throw _iteratorError2;

              case 31:
                return _context2.finish(28);

              case 32:
                return _context2.finish(23);

              case 33:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[2, 19, 23, 33], [24,, 28, 32]]);
      }));

      function register() {
        return _register.apply(this, arguments);
      }

      return register;
    }()
  }, {
    key: "buttonsFromAgreements",
    value: function buttonsFromAgreements() {
      var options = [];
      this.agreements.forEach(function (value, index) {
        options.push({
          type: 'postback',
          text: value.key,
          payload: 'setAgreement:' + value.value.path
        });
      });
      return options;
    }
  }]);

  return Agreement;
}();

var _default = Agreement;
exports["default"] = _default;