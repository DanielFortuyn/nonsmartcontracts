"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DataProvider = /*#__PURE__*/function () {
  function DataProvider() {
    _classCallCheck(this, DataProvider);
  }

  _createClass(DataProvider, [{
    key: "fixData",
    value: function () {
      var _fixData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dataObject) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                dataObject = this.fixMoment(dataObject); // if('partij1' in dataObject && 'hierna' in dataObject.partij1) {
                //     this.setCaseData(dataObject.partij1.hierna, dataObject.partij1);
                // }
                // if('partij2' in dataObject && 'hierna' in dataObject.partij2) {
                //     this.setCaseData(dataObject.partij2.hierna, dataObject.partij2);
                // }

                return _context.abrupt("return", this.traverseData(dataObject));

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fixData(_x) {
        return _fixData.apply(this, arguments);
      }

      return fixData;
    }()
  }, {
    key: "fixMoment",
    value: function fixMoment(dataObject) {
      var momentRegexp = /moment\(\'(.*)\'\)/;

      for (var i in dataObject) {
        var result = momentRegexp.exec(dataObject[i]);

        if (result) {
          dataObject[i] = moment(result[1]).locale('nl', locale).format('LL');
        } //Scheisse recursie


        if (_typeof(dataObject[i]) == "object") {
          dataObject[i] = this.fixMoment(dataObject[i]);
        }
      }

      return dataObject;
    }
  }, {
    key: "setCaseData",
    value: function setCaseData(key, data) {
      this.data[key] = data;
      this.data[key.toLowerCase] = data;
    }
  }, {
    key: "mapType",
    value: function mapType(type) {
      if (type == 'bool') {
        return 'confirm';
      }

      return type || 'text';
    }
  }, {
    key: "set",
    value: function set(obj, str, val) {
      str = str.split(".");

      while (str.length > 1) {
        obj = obj[str.shift()];
      }

      return obj[str.shift()] = val;
    }
  }, {
    key: "traverseData",
    value: function () {
      var _traverseData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(obj) {
        var _this = this;

        var path,
            questions,
            _loop,
            _i,
            _Object$entries,
            _args2 = arguments;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                path = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : '';
                questions = [];

                _loop = function _loop() {
                  var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
                      key = _Object$entries$_i[0],
                      val = _Object$entries$_i[1];

                  if (obj[key]) {
                    if (obj[key].question) {
                      questions.push({
                        'name': key,
                        'message': obj[key].question || key,
                        'question': obj[key],
                        'type': _this.mapType(obj[key].type),
                        'path': path,
                        'depends': obj[key].depends || [],
                        'when': function when(currentAnswers) {
                          var shouldAsk = true;

                          if (obj[key].depends) {
                            obj[key].depends.forEach(function (item) {
                              if (_typeof(currentAnswers[item]) != undefined) {
                                if (currentAnswers[item] == false) {
                                  shouldAsk = false;
                                }
                              }
                            });
                          }

                          return shouldAsk;
                        }
                      });
                    }
                  }

                  if (_typeof(obj[key]) === 'object' && obj[key] !== null) {
                    _this.traverseData(obj[key], path + '.' + key);
                  }
                };

                for (_i = 0, _Object$entries = Object.entries(obj); _i < _Object$entries.length; _i++) {
                  _loop();
                }

                return _context2.abrupt("return", obj);

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function traverseData(_x2) {
        return _traverseData.apply(this, arguments);
      }

      return traverseData;
    }()
  }]);

  return DataProvider;
}();

var _default = DataProvider;
exports["default"] = _default;