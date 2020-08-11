"use strict";

var _smooch = _interopRequireDefault(require("./adapters/smooch.js"));

var _agreement = _interopRequireDefault(require("./providers/agreement.js"));

var _agreement2 = _interopRequireDefault(require("./parsers/agreement.js"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _webhook = _interopRequireDefault(require("./providers/webhook.js"));

var _pubsubJs = _interopRequireDefault(require("pubsub-js"));

var _data = _interopRequireDefault(require("./providers/data.js"));

var _output = _interopRequireDefault(require("./providers/output.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

_dotenv["default"].config();

var e = process.env;
var agreementPath = 'agreements/';
var split = e.SPLITTER || '#-!-#';

var Application = /*#__PURE__*/function () {
  function Application() {
    _classCallCheck(this, Application);

    this.app = new _webhook["default"]();
    this.agreements = new _agreement["default"](agreementPath);
    this.smooch = new _smooch["default"]();
    this.dataProvider = new _data["default"]();
    this.userState = {};
    this.userCurrentQuestion = {};
    this.registerHandlers();
  }

  _createClass(Application, [{
    key: "registerHandlers",
    value: function registerHandlers() {
      var _this = this;

      _pubsubJs["default"].subscribe('conversation:start', function (topic, data) {
        return _this.handleConversationStart(topic, data);
      });

      _pubsubJs["default"].subscribe('postback', function (topic, data) {
        return _this.handlePostback(topic, data);
      });

      _pubsubJs["default"].subscribe('start.asking.questions', function (topic, data) {
        return _this.startAskingQuestions(topic, data);
      });

      _pubsubJs["default"].subscribe('ready.to.ask', function (topic, data) {
        return _this.keepAsking(topic, data);
      });

      _pubsubJs["default"].subscribe('ask.current.question', function (topic, data) {
        return _this.askCurrentQuestion(data);
      });

      _pubsubJs["default"].subscribe('message:appUser', function (topic, data) {
        return _this.parseResponse(topic, data);
      });

      _pubsubJs["default"].subscribe('question.done', function (topic, data) {
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
      this.resetUserState(data.userId);
      var pl = data.message.postbacks[0].action.payload;

      if (pl.includes('setAgreement')) {
        var parts = pl.split(':');
        this.smooch.sendMessage(data.userId, "Oei.. daar komen wel een paar vragen bij kijken. Laten we snel beginnen 🚀", []);

        _pubsubJs["default"].publish('start.asking.questions', {
          userId: data.userId,
          agreement: parts[1]
        });
      }
    }
  }, {
    key: "questionDone",
    value: function questionDone(topic, userId) {
      var md = "";
      console.log("DONE", this.userState[userId]);
      this.output = new _output["default"]();
      this.smooch.sendMessage(userId, "We zijn klaar en genereren je contract! 👍"); // let md = this.output.compileMd(userId, this.userState[userId]);

      var html = this.output.compileHtml(userId, this.userState[userId]);
      var htmlUrl = e.APPLICATION_URL + '/' + html;
      var mdUrl = e.APPLICATION_URL + '/' + md;
      this.smooch.sendMessage(userId, "Hier issie dan: \r\n\r\nOrigineel:" + htmlUrl + "\r\n\r\nEditor:https://stackedit.io/viewer#!url=" + mdUrl);
    }
  }, {
    key: "parseResponse",
    value: function () {
      var _parseResponse = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(topic, data) {
        var uid, response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                uid = data.userId; // console.log("gotresponse", topic, data);
                // await this.smooch.sendMessage(uid, "Bedankt voor het antwoord, we gaan door met de volgende!");
                //Zet het antwoord in de data

                response = data.message.messages[0].text;
                this.persistResponseInData(uid, response); //Unset zodat de volgende vraag gesteld kan worden

                delete this.userCurrentQuestion[uid]; //Vraag de volgende vraag

                _pubsubJs["default"].publish('ready.to.ask', uid);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function parseResponse(_x, _x2) {
        return _parseResponse.apply(this, arguments);
      }

      return parseResponse;
    }()
  }, {
    key: "persistResponseInData",
    value: function persistResponseInData(userId, response) {
      var finalPath = '';

      if (this.userCurrentQuestion[userId].path != '') {
        finalPath = this.userCurrentQuestion[userId].path + "." + this.userCurrentQuestion[userId].key;
        console.log("LOGGING:" + finalPath);
      } else {
        finalPath = this.userCurrentQuestion[userId].key;
      }

      this.dataProvider.set(this.userState[userId].data, finalPath, response);
      return true;
    }
  }, {
    key: "askCurrentQuestion",
    value: function askCurrentQuestion(data) {
      this.smooch.sendMessage(data.userId, data.question);
    }
  }, {
    key: "keepAsking",
    value: function () {
      var _keepAsking = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(topic, data) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.traverseDataObject(data, this.userState[data].data, "");

              case 2:
                if (typeof this.userCurrentQuestion[data] === 'undefined') {
                  _pubsubJs["default"].publish('question.done', data);
                }

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function keepAsking(_x3, _x4) {
        return _keepAsking.apply(this, arguments);
      }

      return keepAsking;
    }()
  }, {
    key: "traverseDataObject",
    value: function () {
      var _traverseDataObject = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(userId, data, path) {
        var _i, _Object$entries, _Object$entries$_i, key, value, finalPath;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                for (_i = 0, _Object$entries = Object.entries(data); _i < _Object$entries.length; _i++) {
                  _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2), key = _Object$entries$_i[0], value = _Object$entries$_i[1];

                  if (typeof this.userCurrentQuestion[userId] === 'undefined') {
                    if (_typeof(value) === 'object' && value !== null) {
                      finalPath = path == '' ? key : path + "." + key;
                      this.traverseDataObject(userId, value, finalPath);

                      if (typeof value.question !== 'undefined') {
                        this.userCurrentQuestion[userId] = {
                          question: value.question,
                          key: key,
                          path: path
                        };

                        _pubsubJs["default"].publish('ask.current.question', {
                          userId: userId,
                          data: data,
                          path: path,
                          question: value.question
                        });
                      }
                    }
                  }
                }

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function traverseDataObject(_x5, _x6, _x7) {
        return _traverseDataObject.apply(this, arguments);
      }

      return traverseDataObject;
    }()
  }, {
    key: "startAskingQuestions",
    value: function () {
      var _startAskingQuestions = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(topic, data) {
        var outputProvider;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                outputProvider = new _output["default"]();
                this.parser = new _agreement2["default"]();
                _context4.next = 4;
                return this.parser.parseFile(data.agreement);

              case 4:
                _context4.next = 6;
                return this.dataProvider.fixData(this.parser.data);

              case 6:
                _context4.t0 = _context4.sent;
                _context4.t1 = data.userId;
                _context4.t2 = data.agreement;
                _context4.t3 = this.parser.agreementText;
                _context4.t4 = outputProvider.loadTemplate(this.parser.agreementText);
                this.userState[data.userId] = {
                  data: _context4.t0,
                  userId: _context4.t1,
                  agreement: _context4.t2,
                  agreementText: _context4.t3,
                  agreementTemplate: _context4.t4
                };

                _pubsubJs["default"].publish('ready.to.ask', data.userId);

              case 13:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function startAskingQuestions(_x8, _x9) {
        return _startAskingQuestions.apply(this, arguments);
      }

      return startAskingQuestions;
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
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var application;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            try {
              application = new Application();
            } catch (e) {
              console.error(e);
            }

          case 1:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function main() {
    return _ref.apply(this, arguments);
  };
}();

main();