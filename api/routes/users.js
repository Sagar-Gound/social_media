import { Router } from "express";
import { checkObjectId } from "../helper.js";
import {
  getUser,
  updateUser,
  deleteUser,
  followUser,
  unfollowUser,
  friendDetails,
  getAllUsers,
  getAllFriends,
  searchUser,
} from "../controller/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

export const userRoute = Router();

// Get all users
userRoute.get("/all", getAllUsers);

// Search user by username
userRoute.get("/search", searchUser);

// Get a user by ID
userRoute.get("/:id", checkObjectId, getUser);

// Update a user by ID
userRoute.put("/:id", checkObjectId, updateUser);

// Delete a user by ID
userRoute.delete("/:id", checkObjectId, deleteUser);

// follow a user
userRoute.put("/:id/follow", verifyToken, checkObjectId, followUser);

// unfollow a user
userRoute.put("/:id/unfollow", verifyToken, checkObjectId, unfollowUser);

// get friend's data
userRoute.get("/friends/:id", checkObjectId, friendDetails)

// Get all friends of a user
userRoute.get("/:id/friends", checkObjectId, getAllFriends);