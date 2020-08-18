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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var e = _config.config.env;

var Question = function Question(key, question, path) {
  _classCallCheck(this, Question);

  this.question = question.question;
  this.key = key;
  this.path = path;
  this["default"] = question["default"];
};

var _default = Question;
exports["default"] = _default;