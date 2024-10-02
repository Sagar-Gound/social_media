"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unfollowUser = exports.followUser = exports.deleteUser = exports.updateUser = exports.getUser = void 0;

var _User = require("../models/User.js");

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var getUser = function getUser(req, res) {
  var id, user, _user$_doc, password, updatedAt, other;

  return regeneratorRuntime.async(function getUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          id = req.params.id;

          if (id) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(400).send({
            message: "User ID is required"
          }));

        case 3:
          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap(_User.User.findById(id));

        case 6:
          user = _context.sent;

          if (!user) {
            _context.next = 12;
            break;
          }

          _user$_doc = user._doc, password = _user$_doc.password, updatedAt = _user$_doc.updatedAt, other = _objectWithoutProperties(_user$_doc, ["password", "updatedAt"]);
          return _context.abrupt("return", res.status(200).json(other));

        case 12:
          return _context.abrupt("return", res.status(404).json({
            message: "User not found"
          }));

        case 13:
          _context.next = 19;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](3);
          console.error(_context.t0);
          return _context.abrupt("return", res.status(500).json({
            message: "Something went wrong while getting the user!",
            error: _context.t0.message
          }));

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 15]]);
};

exports.getUser = getUser;

var updateUser = function updateUser(req, res) {
  var user, _user$_doc2, password, updatedAt, other;

  return regeneratorRuntime.async(function updateUser$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!(req.body.userId === req.params.id || req.body.isAdmin)) {
            _context2.next = 15;
            break;
          }

          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(_User.User.findByIdAndUpdate(req.params.id, {
            $set: req.body
          }, {
            "new": true
          }));

        case 4:
          user = _context2.sent;
          _user$_doc2 = user._doc, password = _user$_doc2.password, updatedAt = _user$_doc2.updatedAt, other = _objectWithoutProperties(_user$_doc2, ["password", "updatedAt"]);
          return _context2.abrupt("return", res.status(200).json(other));

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](1);
          console.log(_context2.t0);
          return _context2.abrupt("return", res.status(500).json({
            message: "Something went wrong while updating the user!",
            error: _context2.t0.message
          }));

        case 13:
          _context2.next = 16;
          break;

        case 15:
          return _context2.abrupt("return", res.status(403).json({
            message: "You can update only your account!"
          }));

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 9]]);
};

exports.updateUser = updateUser;

var deleteUser = function deleteUser(req, res) {
  var user, _user$_doc3, password, updatedAt, other;

  return regeneratorRuntime.async(function deleteUser$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (!(req.body.userId === req.params.id || req.body.isAdmin)) {
            _context3.next = 15;
            break;
          }

          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(_User.User.findByIdAndDelete(req.params.id));

        case 4:
          user = _context3.sent;
          _user$_doc3 = user._doc, password = _user$_doc3.password, updatedAt = _user$_doc3.updatedAt, other = _objectWithoutProperties(_user$_doc3, ["password", "updatedAt"]);
          return _context3.abrupt("return", res.status(200).json({
            message: "User deleted successfully!",
            other: other
          }));

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](1);
          console.log(_context3.t0);
          return _context3.abrupt("return", res.status(500).json({
            message: "Something went wrong while deleting the user!",
            error: _context3.t0.message
          }));

        case 13:
          _context3.next = 16;
          break;

        case 15:
          return _context3.abrupt("return", res.status(403).json({
            message: "You can delete only your account!"
          }));

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 9]]);
};

exports.deleteUser = deleteUser;

var followUser = function followUser(req, res) {
  var user, currentUser;
  return regeneratorRuntime.async(function followUser$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (!(req.body.userId !== req.params.id)) {
            _context4.next = 25;
            break;
          }

          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(_User.User.findById(req.params.id));

        case 4:
          user = _context4.sent;
          _context4.next = 7;
          return regeneratorRuntime.awrap(_User.User.findById(req.body.userId));

        case 7:
          currentUser = _context4.sent;

          if (user.followers.includes(req.body.userId)) {
            _context4.next = 16;
            break;
          }

          _context4.next = 11;
          return regeneratorRuntime.awrap(user.updateOne({
            $push: {
              followers: req.body.userId
            }
          }));

        case 11:
          _context4.next = 13;
          return regeneratorRuntime.awrap(currentUser.updateOne({
            $push: {
              followings: req.params.id
            }
          }));

        case 13:
          return _context4.abrupt("return", res.status(200).json({
            message: "User followed successfully!"
          }));

        case 16:
          return _context4.abrupt("return", res.status(403).json({
            message: "You already follow this user!"
          }));

        case 17:
          _context4.next = 23;
          break;

        case 19:
          _context4.prev = 19;
          _context4.t0 = _context4["catch"](1);
          console.log(_context4.t0);
          return _context4.abrupt("return", res.status(500).json({
            message: "Something went wrong while following the user!",
            error: _context4.t0.message
          }));

        case 23:
          _context4.next = 26;
          break;

        case 25:
          return _context4.abrupt("return", res.status(403).json({
            message: "You can't follow yourself!"
          }));

        case 26:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 19]]);
};

exports.followUser = followUser;

var unfollowUser = function unfollowUser(req, res) {
  var user, currentUser;
  return regeneratorRuntime.async(function unfollowUser$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          if (!(req.body.userId !== req.params.id)) {
            _context5.next = 25;
            break;
          }

          _context5.prev = 1;
          _context5.next = 4;
          return regeneratorRuntime.awrap(_User.User.findById(req.params.id));

        case 4:
          user = _context5.sent;
          _context5.next = 7;
          return regeneratorRuntime.awrap(_User.User.findById(req.body.userId));

        case 7:
          currentUser = _context5.sent;

          if (!user.followers.includes(req.body.userId)) {
            _context5.next = 16;
            break;
          }

          _context5.next = 11;
          return regeneratorRuntime.awrap(user.updateOne({
            $pull: {
              followers: req.body.userId
            }
          }));

        case 11:
          _context5.next = 13;
          return regeneratorRuntime.awrap(currentUser.updateOne({
            $pull: {
              followings: req.params.id
            }
          }));

        case 13:
          return _context5.abrupt("return", res.status(200).json({
            message: "User unfollowed successfully!"
          }));

        case 16:
          return _context5.abrupt("return", res.status(403).json({
            message: "You don't follow this user!"
          }));

        case 17:
          _context5.next = 23;
          break;

        case 19:
          _context5.prev = 19;
          _context5.t0 = _context5["catch"](1);
          console.log(_context5.t0);
          return _context5.abrupt("return", res.status(500).json({
            message: "Something went wrong while unfollowing the user!",
            error: _context5.t0.message
          }));

        case 23:
          _context5.next = 26;
          break;

        case 25:
          return _context5.abrupt("return", res.status(403).json({
            message: "You can't unfollow yourself!"
          }));

        case 26:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 19]]);
};

exports.unfollowUser = unfollowUser;