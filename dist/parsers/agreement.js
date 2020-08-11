"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _handlebars = _interopRequireDefault(require("handlebars"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _marked = _interopRequireDefault(require("marked"));

var _fs = _interopRequireDefault(require("fs"));

var _yaml = _interopRequireDefault(require("yaml"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

_dotenv["default"].config();

var e = process.env;
var split = e.SPLITTER || "#-!-#";

var Agreement = /*#__PURE__*/function () {
  function Agreement() {
    _classCallCheck(this, Agreement);

    this.data = {};
    this.agreementText = '';
  }

  _createClass(Agreement, [{
    key: "loadPartials",
    value: function loadPartials() {}
  }, {
    key: "parseFile",
    value: function () {
      var _parseFile = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(path) {
        var file, parts;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _fs["default"].readFileSync(path, 'utf8');

              case 2:
                file = _context.sent;
                parts = file.split(split);
                console.log("SPLITTER", split, parts.length);

                if (!(parts.length == 3)) {
                  _context.next = 9;
                  break;
                }

                this.data = this.parseData(parts[1]);
                this.agreementText = parts[2];
                return _context.abrupt("return", this.agreementText);

              case 9:
                this.agreementText = file;
                return _context.abrupt("return", this.agreementText);

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function parseFile(_x) {
        return _parseFile.apply(this, arguments);
      }

      return parseFile;
    }()
  }, {
    key: "parseData",
    value: function parseData(part) {
      this.data = _yaml["default"].parse(part);
      return this.data;
    }
  }]);

  return Agreement;
}();

var _default = Agreement;
exports["default"] = _default;