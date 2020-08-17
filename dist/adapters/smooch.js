"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _smoochCore = _interopRequireDefault(require("smooch-core"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _config = require("../providers/config.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var e = _config.config.env;

var SmoochAdapter = /*#__PURE__*/function () {
  function SmoochAdapter() {
    _classCallCheck(this, SmoochAdapter);

    this.smooch = new _smoochCore["default"]({
      keyId: e.SMOOCH_KEY,
      secret: e.SMOOCH_SECRET,
      scope: 'app' // account, app, or appUser

    });
  }

  _createClass(SmoochAdapter, [{
    key: "triggerHandler",
    value: function triggerHandler() {
      switch (smoochMessage.trigger) {
        case 'conversation:start':
          this.handleConversationStart();
          return smoochMessage.appUser._id;
      }
    }
  }, {
    key: "agreementsToMessage",
    value: function agreementsToMessage() {
      var actions = [];
      this.agreements.forEach(function (val) {
        actions.push({
          type: 'postback',
          text: val.key || 'null',
          payload: val.key || 'null'
        });
      });
      return actions;
    }
  }, {
    key: "sendMessage",
    value: function () {
      var _sendMessage = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(userId, message) {
        var actions,
            _args = arguments;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                actions = _args.length > 2 && _args[2] !== undefined ? _args[2] : [];
                _context.next = 3;
                return this.smooch.appUsers.sendMessage({
                  userId: userId,
                  message: {
                    type: 'text',
                    text: message,
                    role: 'appMaker',
                    actions: actions
                  }
                }).then(function (response) {// console.log('API RESPONSE:\n', response);
                })["catch"](function (err) {
                  console.log('API ERROR:\n', err);
                });

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function sendMessage(_x, _x2) {
        return _sendMessage.apply(this, arguments);
      }

      return sendMessage;
    }()
  }]);

  return SmoochAdapter;
}();

var _default = SmoochAdapter;
exports["default"] = _default;