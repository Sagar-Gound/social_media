"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userRoute = void 0;

var _express = require("express");

var _helper = require("../helper.js");

var _userController = require("../controller/user.controller.js");

var userRoute = (0, _express.Router)(); // Get a user by ID

exports.userRoute = userRoute;
userRoute.get("/:id", _helper.checkObjectId, _userController.getUser); // Update u user by ID

userRoute.put("/:id", _helper.checkObjectId, _userController.updateUser); // Delete a user by ID

userRoute["delete"]("/:id", _helper.checkObjectId, _userController.deleteUser); // follow a user

userRoute.put("/:id/follow", _helper.checkObjectId, _userController.followUser); // unfollow a user

userRoute.put("/:id/unfollow", _helper.checkObjectId);