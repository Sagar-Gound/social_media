import { Router } from "express";
import { checkObjectId } from "../helper.js";
import {
  getUser,
  updateUser,
  deleteUser,
  followUser,
  unfollowUser,
} from "../controller/user.controller.js";

export const userRoute = Router();

// Get a user by ID
userRoute.get("/:id", checkObjectId, getUser);

// Update u user by ID
userRoute.put("/:id", checkObjectId, updateUser);

// Delete a user by ID
userRoute.delete("/:id", checkObjectId, deleteUser);

// follow a user
userRoute.put("/:id/follow", checkObjectId, followUser);

// unfollow a user
userRoute.put("/:id/unfollow", checkObjectId, unfollowUser);
