import { Router } from "express";
import { loginUser, registerUser } from "../controller/auth.controller.js";


export const authRoute = Router();

// Register a new user
authRoute.post("/register", registerUser);

// Login a user
authRoute.post("/login", loginUser);
