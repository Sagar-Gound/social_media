"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authRoute = void 0;

var _express = require("express");

var _authController = require("../controller/auth.controller.js");

var authRoute = (0, _express.Router)(); // Register a new user

exports.authRoute = authRoute;
authRoute.post("/register", _authController.registerUser); // Login a user

authRoute.post("/login", _authController.loginUser);