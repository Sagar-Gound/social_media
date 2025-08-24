import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controller/auth.controller.js";


export const authRoute = Router();

// Register a new user
authRoute.post("/register", registerUser);

// Login a user
authRoute.post("/login", loginUser);

// Logout a user
authRoute.post("/logout", logoutUser);
