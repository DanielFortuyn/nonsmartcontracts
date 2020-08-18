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

var _config = require("../providers/config.js");

var _pubsubJs = _interopRequireDefault(require("pubsub-js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var e = _config.config.env;
var split = e.SPLITTER || "#-!-#";

var File = /*#__PURE__*/function () {
  function File() {
    _classCallCheck(this, File);
  }

  _createClass(File, [{
    key: "parseFile",
    value: function () {
      var _parseFile = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(userId, path) {
        var file, fileContents, parts;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                file = {};
                _context.next = 3;
                return _fs["default"].readFileSync(path, 'utf8');

              case 3:
                fileContents = _context.sent;
                parts = fileContents.split(split);

                if (!(parts.length == 3)) {
                  _context.next = 9;
                  break;
                }

                file.data = _yaml["default"].parse(parts[1]);
                file.text = parts[2];
                return _context.abrupt("return", file);

              case 9:
                file.text = fileContents;
                return _context.abrupt("return", file);

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function parseFile(_x, _x2) {
        return _parseFile.apply(this, arguments);
      }

      return parseFile;
    }()
  }]);

  return File;
}();

var _default = File;
exports["default"] = _default;