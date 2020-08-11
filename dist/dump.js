"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var helpers = {
  search: function search(input, values, defaultValue) {
    input = input || '';
    return new Promise(function (resolve) {
      try {
        if (input == '') {
          resolve([defaultValue]);
        } else {
          var options = {
            extract: function extract(el) {
              return el.name;
            }
          };
          var fuzzyResult = fuzzy.filter(input, values, options);
          resolve(fuzzyResult.map(function (el) {
            return el.original;
          }));
        }
      } catch (e) {
        console.error(e);
      }
    });
  },
  handleQuestion: function () {
    var _handleQuestion = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(name, questionObject) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return inquirer.prompt({
                name: name,
                message: questionObject.question
              });

            case 2:
              return _context.abrupt("return", _context.sent);

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function handleQuestion(_x, _x2) {
      return _handleQuestion.apply(this, arguments);
    }

    return handleQuestion;
  }(),
  handleQuestions: function handleQuestions() {
    return inquirer.prompt(this.questions);
  },
  askAgreement: function () {
    var _askAgreement = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var self;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              self = this;
              _context2.next = 3;
              return inquirer.prompt([{
                name: 'agreement',
                type: "autocomplete",
                choices: self.agreements,
                source: function source(answers, input) {
                  return self.search(input, self.agreements, self.agreements[0]);
                }
              }]);

            case 3:
              return _context2.abrupt("return", _context2.sent);

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function askAgreement() {
      return _askAgreement.apply(this, arguments);
    }

    return askAgreement;
  }()
};