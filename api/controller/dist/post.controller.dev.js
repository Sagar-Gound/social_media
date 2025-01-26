"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deletePost = exports.likeAndDislikePost = exports.getPost = exports.updatePost = exports.createPost = void 0;

var _Post = require("../models/Post.js");

var createPost = function createPost(req, res) {
  var _req$body, userId, desc, likes, img, newPost, data;

  return regeneratorRuntime.async(function createPost$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, userId = _req$body.userId, desc = _req$body.desc, likes = _req$body.likes, img = _req$body.img;

          if (!(userId && desc && likes && img)) {
            _context.next = 15;
            break;
          }

          _context.prev = 2;
          newPost = new _Post.Post({
            userId: userId,
            desc: desc,
            likes: likes,
            img: img
          });
          _context.next = 6;
          return regeneratorRuntime.awrap(newPost.save());

        case 6:
          data = _context.sent;
          return _context.abrupt("return", res.status(200).json({
            message: "Post created successfully",
            data: data
          }));

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](2);
          return _context.abrupt("return", res.status(500).json({
            message: "error occured while creating a post",
            error: _context.t0.message
          }));

        case 13:
          _context.next = 16;
          break;

        case 15:
          return _context.abrupt("return", res.status(500).json({
            error: "Please provide all details like userId, desc, likes and img"
          }));

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 10]]);
};

exports.createPost = createPost;

var updatePost = function updatePost(req, res) {
  var postId, post, updatedPost;
  return regeneratorRuntime.async(function updatePost$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          postId = req.params.id;
          _context2.next = 4;
          return regeneratorRuntime.awrap(_Post.Post.findOne({
            _id: postId
          }));

        case 4:
          post = _context2.sent;

          if (!(post.userId === req.body.userId)) {
            _context2.next = 12;
            break;
          }

          _context2.next = 8;
          return regeneratorRuntime.awrap(post.updateOne({
            $set: req.body
          }));

        case 8:
          updatedPost = _context2.sent;
          return _context2.abrupt("return", res.status(200).json({
            message: "Post updated successfully!",
            post: updatedPost
          }));

        case 12:
          return _context2.abrupt("return", res.status(400).json({
            message: "You can only update your own post"
          }));

        case 13:
          _context2.next = 18;
          break;

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", res.status(500).json({
            message: "An error occurred while updating the post",
            error: _context2.t0.message
          }));

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

exports.updatePost = updatePost;

var getPost = function getPost(req, res) {
  var postId, post;
  return regeneratorRuntime.async(function getPost$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          postId = req.params.id;
          _context3.next = 4;
          return regeneratorRuntime.awrap(_Post.Post.findOne({
            _id: postId
          }));

        case 4:
          post = _context3.sent;
          return _context3.abrupt("return", res.status(200).json({
            message: "post fetching was successful",
            post: post
          }));

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          return _context3.abrupt("return", res.status(500).json({
            message: "An error occurred while fethcing post",
            error: _context3.t0.message
          }));

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.getPost = getPost;

var likeAndDislikePost = function likeAndDislikePost(req, res) {
  var postId, userId, post, updateOperation, updatedPost, message;
  return regeneratorRuntime.async(function likeAndDislikePost$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          postId = req.params.id;
          userId = req.body.userId;
          _context4.next = 5;
          return regeneratorRuntime.awrap(_Post.Post.findById(postId));

        case 5:
          post = _context4.sent;
          updateOperation = post.likes.includes(userId) ? {
            $pull: {
              likes: userId
            }
          } : {
            $addToSet: {
              likes: userId
            }
          };
          _context4.next = 9;
          return regeneratorRuntime.awrap(_Post.Post.findByIdAndUpdate(postId, updateOperation, {
            "new": true
          }));

        case 9:
          updatedPost = _context4.sent;
          message = post.likes.includes(userId) ? "Post disliked successfully!" : "Post liked successfully!";
          return _context4.abrupt("return", res.status(200).json({
            message: message,
            post: updatedPost
          }));

        case 14:
          _context4.prev = 14;
          _context4.t0 = _context4["catch"](0);
          return _context4.abrupt("return", res.status(500).json({
            message: "An error occurred while liking/disliking the post",
            error: _context4.t0.message
          }));

        case 17:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

exports.likeAndDislikePost = likeAndDislikePost;

var deletePost = function deletePost(req, res) {
  return regeneratorRuntime.async(function deletePost$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
        case "end":
          return _context5.stop();
      }
    }
  });
};

exports.deletePost = deletePost;