"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Create an Axios instance with a base URL
var instance = _axios["default"].create({
  baseURL: "http://localhost:4000/api"
});

var _default = instance;
exports["default"] = _default;