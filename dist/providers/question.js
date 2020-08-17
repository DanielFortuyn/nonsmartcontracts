"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;

var _pubsubJs = _interopRequireDefault(require("pubsub-js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Question = /*#__PURE__*/function () {
  function Question() {
    _classCallCheck(this, Question);

    this.questions;

    _pubsubJs["default"].subscribe('add.question', this.addQuestion);
  }

  _createClass(Question, [{
    key: "addQuestion",
    value: function addQuestion(topic, data) {
      this.quesions[data.userId].push(data.question);
    }
  }]);

  return Question;
}();

var config = new Config();
exports.config = config;