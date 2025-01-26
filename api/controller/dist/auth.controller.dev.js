"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loginUser = exports.registerUser = void 0;

var _User = require("../models/User.js");

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var registerUser = function registerUser(req, res) {
  var _req$body, username, email, password, hashedPassword, newUser, user, _user$_doc, _password, filteredUserInfo;

  return regeneratorRuntime.async(function registerUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, username = _req$body.username, email = _req$body.email, password = _req$body.password; // Custom user validation logic

          if (!(!username || username.trim().length < 3)) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "Username must be at least 3 characters long"
          }));

        case 3:
          if (!(!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "Please provide a valid email address"
          }));

        case 5:
          if (!(!password || password.length < 6)) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "Password must be at least 6 characters long"
          }));

        case 7:
          hashedPassword = _bcryptjs["default"].hashSync(password, 10);
          _context.prev = 8;
          newUser = new _User.User({
            username: username,
            email: email,
            password: hashedPassword
          });
          _context.next = 12;
          return regeneratorRuntime.awrap(newUser.save());

        case 12:
          user = _context.sent;
          _user$_doc = user._doc, _password = _user$_doc.password, filteredUserInfo = _objectWithoutProperties(_user$_doc, ["password"]);
          return _context.abrupt("return", res.status(201).json({
            message: "User registered successfully",
            filteredUserInfo: filteredUserInfo
          }));

        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](8);
          return _context.abrupt("return", res.status(409).json({
            message: "User already exists"
          }));

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[8, 17]]);
};

exports.registerUser = registerUser;

var loginUser = function loginUser(req, res) {
  var _req$body2, email, password, user, _user$_doc2, _password2, filteredUserInfo;

  return regeneratorRuntime.async(function loginUser$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          console.log(req.body); // custom user validation logic

          if (!(!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: "Please provide a valid email address"
          }));

        case 4:
          if (!(!password || password.length < 6)) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: "Password must be at least 6 characters long"
          }));

        case 6:
          _context2.prev = 6;
          _context2.next = 9;
          return regeneratorRuntime.awrap(_User.User.findOne({
            email: email
          }));

        case 9:
          user = _context2.sent;

          if (user) {
            _context2.next = 12;
            break;
          }

          return _context2.abrupt("return", res.status(401).json({
            message: "Invalid email or password"
          }));

        case 12:
          if (!_bcryptjs["default"].compareSync(password, user.password)) {
            _context2.next = 15;
            break;
          }

          _user$_doc2 = user._doc, _password2 = _user$_doc2.password, filteredUserInfo = _objectWithoutProperties(_user$_doc2, ["password"]);
          return _context2.abrupt("return", res.status(200).json({
            message: "User logged in successfully",
            filteredUserInfo: filteredUserInfo
          }));

        case 15:
          _context2.next = 20;
          break;

        case 17:
          _context2.prev = 17;
          _context2.t0 = _context2["catch"](6);
          return _context2.abrupt("return", res.status(401).json({
            message: "Invalid email or password"
          }));

        case 20:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[6, 17]]);
};

exports.loginUser = loginUser;