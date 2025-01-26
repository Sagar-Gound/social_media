"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loginCall = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var loginCall = function loginCall(userCredential, dispatch) {
  var res;
  return regeneratorRuntime.async(function loginCall$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          dispatch({
            type: "LOGIN_START"
          });
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(_axios["default"].post("/auth/login", userCredential));

        case 4:
          res = _context.sent;
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: res.data
          });
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](1);
          dispatch({
            type: "LOGIN_FAILURE",
            payload: _context.t0
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

exports.loginCall = loginCall;