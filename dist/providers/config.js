"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

var _pubsubJs = _interopRequireDefault(require("pubsub-js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

_dotenv["default"].config();

var Config = /*#__PURE__*/function () {
  function Config() {
    _classCallCheck(this, Config);

    var e = process.env;
    this.env = process.env;
    this.split = e.SPLITTER || "#-!-#";
    this.store = {};
  }

  _createClass(Config, [{
    key: "set",
    value: function set(key, value) {
      this.store[key] = value;
    }
  }]);

  return Config;
}();

var config = new Config();
exports.config = config;