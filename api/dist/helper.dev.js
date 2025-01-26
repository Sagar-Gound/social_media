"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkObjectId = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Middleware to check if the ID is a valid ObjectId
var checkObjectId = function checkObjectId(req, res, next) {
  if (!_mongoose["default"].Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json("Invalid ID");
  }

  next();
};

exports.checkObjectId = checkObjectId;