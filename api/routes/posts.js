import { Router } from "express";
import {
  createPost,
  getPost,
  updatePost,
  likeAndDislikePost,
  deletePost,
  getAllUserPost,
  getMyPosts,
  getTimelinePosts,
  getUserPosts,
} from "../controller/post.controller.js";
import { checkObjectId } from "../helper.js";

export const postRoute = Router();

// create a post
postRoute.post("/", createPost);

// update a post
postRoute.put("/:id", checkObjectId, updatePost);

// get a post
postRoute.get("/:id", checkObjectId, getPost);

// get all user post
postRoute.get("/allPosts/:id", checkObjectId, getAllUserPost);

// like a post
postRoute.put("/like/:id", checkObjectId, likeAndDislikePost);

// delete a post
postRoute.delete("/:id", checkObjectId, deletePost);

// get timeline posts with pagination (all posts from all users)
postRoute.get("/timeline/:id", checkObjectId, getTimelinePosts);

// get user-specific posts with pagination
postRoute.get("/user/:id", checkObjectId, getUserPosts);

// Get all of my posts
postRoute.get("/myPosts/:id", checkObjectId, getMyPosts);