"use strict";

var _smooch = _interopRequireDefault(require("./adapters/smooch.js"));

var _agreement = _interopRequireDefault(require("./providers/agreement.js"));

var _file = _interopRequireDefault(require("./parsers/file.js"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _webhook = _interopRequireDefault(require("./providers/webhook.js"));

var _pubsubJs = _interopRequireDefault(require("pubsub-js"));

var _data = _interopRequireDefault(require("./providers/data.js"));

var _output = _interopRequireDefault(require("./providers/output.js"));

var _config = require("./providers/config.js");

var _agreement2 = _interopRequireDefault(require("./container/agreement.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Application = /*#__PURE__*/function () {
  function Application() {
    _classCallCheck(this, Application);

    this.config = _config.config;
    this.app = new _webhook["default"]();
    this.agreements = new _agreement["default"](_config.config.env.AGREEMENT_PATH || './agreements');
    this.smooch = new _smooch["default"]();
    this.dataProvider = new _data["default"]();
    this.parser = new _file["default"]();
    this.userState = {};
    this.registerHandlers();
  }

  _createClass(Application, [{
    key: "registerHandlers",
    value: function registerHandlers() {
      var _this = this;

      _pubsubJs["default"].subscribe('conversation:start', function (topic, data) {
        return _this.handleConversationStart(topic, data);
      });

      _pubsubJs["default"].subscribe('message:appUser', function (topic, data) {
        return _this.parseResponse(topic, data);
      });

      _pubsubJs["default"].subscribe('postback', function (topic, data) {
        return _this.handlePostback(topic, data);
      });

      _pubsubJs["default"].subscribe('', function (topic, data) {
        return _this.setAgreement(topic, data);
      });

      _pubsubJs["default"].subscribe('ready.to.ask', function (topic, data) {
        return _this.readyToAsk(topic, data);
      }); // PubSub.subscribe('ask.current.question', (topic, data) => this.askCurrentQuestion(data));


      _pubsubJs["default"].subscribe('questions.done', function (topic, data) {
        return _this.questionDone(topic, data);
      });
    }
  }, {
    key: "handleConversationStart",
    value: function handleConversationStart(topic, data) {
      this.resetUserState(data.userId);
      this.smooch.sendMessage(data.userId, 'Hallo! Welke overeenkomst wil je maken?', this.agreements.buttonsFromAgreements());
    }
  }, {
    key: "handlePostback",
    value: function handlePostback(topic, data) {
      this.setAgreement(data);
    }
  }, {
    key: "setAgreement",
    value: function setAgreement(data) {
      this.resetUserState(data.userId);
      var pl = data.message.postbacks[0].action.payload;

      if (pl.includes('setAgreement')) {
        var parts = pl.split(':'); // this.smooch.sendMessage(data.userId, "Oei.. daar komen wel een paar vragen bij kijken. Laten we snel beginnen 🚀", []);

        this.initializeAgreement(data.userId, parts[1]);
      }
    }
  }, {
    key: "initializeAgreement",
    value: function () {
      var _initializeAgreement = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(userId, agreementName) {
        var file;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.parser.parseFile(userId, agreementName);

              case 2:
                file = _context.sent;
                this.output = new _output["default"]();
                _context.next = 6;
                return this.output.init();

              case 6:
                this.userState[userId] = new _agreement2["default"](agreementName, userId, file.text, file.data);
                this.userState[userId].compiled = this.output.preProcess(this.userState[userId]);

                _pubsubJs["default"].publish('ready.to.ask', userId);

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function initializeAgreement(_x, _x2) {
        return _initializeAgreement.apply(this, arguments);
      }

      return initializeAgreement;
    }()
  }, {
    key: "questionDone",
    value: function questionDone(topic, userId) {
      console.log("DONE", this.userState[userId]); // this.smooch.sendMessage(userId, "We zijn klaar en genereren je contract! 👍")

      var md = this.output.compileMd(userId, this.userState[userId]);
      var html = this.output.compileHtml(userId, this.userState[userId]);
      var htmlUrl = this.config.env.APPLICATION_URL + '/' + html;
      var mdUrl = this.config.env.APPLICATION_URL + '/' + md;
      this.smooch.sendMessage(userId, "Hier issie dan: \r\n\r\nOrigineel:" + htmlUrl + "\r\n\r\nEditor:https://stackedit.io/viewer#!url=" + mdUrl);
    }
  }, {
    key: "parseResponse",
    value: function () {
      var _parseResponse = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(topic, data) {
        var uid, response;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                uid = data.userId; // console.log("gotresponse", topic, data);
                // await this.smooch.sendMessage(uid, "Bedankt voor het antwoord, we gaan door met de volgende!");
                //Zet het antwoord in de data

                response = data.message.messages[0].text;
                this.persistResponseInData(uid, response); //Unset zodat de volgende vraag gesteld kan worden

                _pubsubJs["default"].publish('ready.to.ask', uid);

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function parseResponse(_x3, _x4) {
        return _parseResponse.apply(this, arguments);
      }

      return parseResponse;
    }()
  }, {
    key: "persistResponseInData",
    value: function persistResponseInData(userId, response) {
      var finalPath = '';
      var agreement = this.userState[userId];

      if (agreement.currentQuestion.path != '') {
        finalPath = agreement.currentQuestion.path + "." + agreement.currentQuestion.key;
        console.log("LOGGING:" + finalPath);
      } else {
        finalPath = agreement.currentQuestion.key;
      }

      agreement.provideAnswer(finalPath, response);
      return true;
    }
  }, {
    key: "readyToAsk",
    value: function () {
      var _readyToAsk = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(topic, data) {
        var question;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                question = this.userState[data].fetchQuestion();

                if (typeof question === 'undefined') {
                  _pubsubJs["default"].publish('questions.done', data);
                } else {
                  this.smooch.sendMessage(data, question.question);
                }

              case 2:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function readyToAsk(_x5, _x6) {
        return _readyToAsk.apply(this, arguments);
      }

      return readyToAsk;
    }()
  }, {
    key: "resetUserState",
    value: function resetUserState(userId) {
      delete this.userState[userId];
    }
  }]);

  return Application;
}();

var main = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var application;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            try {
              application = new Application();
            } catch (e) {
              console.error(e);
            }

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function main() {
    return _ref.apply(this, arguments);
  };
}();

main();