"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postRoute = void 0;

var _express = require("express");

var _postController = require("../controller/post.controller.js");

var _helper = require("../helper.js");

var postRoute = (0, _express.Router)(); // create a post

exports.postRoute = postRoute;
postRoute.post("/", _postController.createPost); // update a post

postRoute.put("/:id", _helper.checkObjectId, _postController.updatePost); // get a post

postRoute.get("/:id", _helper.checkObjectId, _postController.getPost); // like a post

postRoute.put("/like/:id", _helper.checkObjectId, _postController.likeAndDislikePost); // delete a post

postRoute["delete"]("/:id", _helper.checkObjectId, _postController.deletePost);