import { Router } from "express";
import {
  createPost,
  getPost,
  updatePost,
  likeAndDislikePost,
  deletePost,
} from "../controller/post.controller.js";
import { checkObjectId } from "../helper.js";

export const postRoute = Router();

// create a post
postRoute.post("/", createPost);

// update a post
postRoute.put("/:id", checkObjectId, updatePost);

// get a post
postRoute.get("/:id", checkObjectId, getPost);

// like a post
postRoute.put("/like/:id", checkObjectId, likeAndDislikePost);

// delete a post
postRoute.delete("/:id", checkObjectId, deletePost);
