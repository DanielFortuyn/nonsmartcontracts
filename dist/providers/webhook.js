"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _express = _interopRequireDefault(require("express"));

var _pubsubJs = _interopRequireDefault(require("pubsub-js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

_dotenv["default"].config();

var e = process.env;
var port = e.PORT || 8080;

var WebhookProvider = /*#__PURE__*/function () {
  function WebhookProvider() {
    var _this = this;

    _classCallCheck(this, WebhookProvider);

    this.app = (0, _express["default"])();
    this.app.use(_express["default"].json());
    this.app.use(_express["default"]["static"]('output'));
    this.app.get('/', function (req, res) {
      return res.send('Hello World!');
    });
    this.app.post('/', function (req, res) {
      _this.inboundHandler(req.body);

      return res.send('ok');
    });
    this.app.listen(port, function () {
      return console.log("Lexr telegram listening at http://localhost:".concat(port));
    });
  }

  _createClass(WebhookProvider, [{
    key: "inboundHandler",
    value: function inboundHandler(smoochMessage) {
      console.log(smoochMessage.trigger);

      _pubsubJs["default"].publish(smoochMessage.trigger, {
        userId: this.getUserId(smoochMessage),
        message: smoochMessage
      });

      return 'ok';
    }
  }, {
    key: "getUserId",
    value: function getUserId(smoochMessage) {
      if (typeof smoochMessage.appUser != 'undefined' && typeof smoochMessage.appUser._id != 'undefined') {
        return smoochMessage.appUser._id;
      }
    }
  }, {
    key: "getApp",
    value: function getApp() {
      return this.app;
    }
  }]);

  return WebhookProvider;
}();

var _default = WebhookProvider;
exports["default"] = _default;