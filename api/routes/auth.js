import { Router } from "express";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";

export const authRoute = Router();

// Register a new user
authRoute.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Custom user validation logic
  if (!username || username.trim().length < 3) {
    return res
      .status(400)
      .json({ error: "Username must be at least 3 characters long" });
  }
  if (
    !email ||
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
  ) {
    return res
      .status(400)
      .json({ error: "Please provide a valid email address" });
  }
  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters long" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const { password, ...filteredUserInfo } = user._doc;

    return res.status(201).json({
      message: "User registered successfully",
      filteredUserInfo,
    });
  } catch (error) {
    return res.status(409).json({
      message: "User already exists",
    });
  }
});

// Login a user
authRoute.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // custom user validation logic
  if (
    !email ||
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
  ) {
    return res
      .status(400)
      .json({ error: "Please provide a valid email address" });
  }
  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters long" });
  }

  try {
    const user = await User.findOne({ email });

    // if user doesn't exist
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // if user exists
    if (bcrypt.compareSync(password, user.password)) {
      const { password, ...filteredUserInfo } = user._doc;

      return res.status(200).json({
        message: "User logged in successfully",
        filteredUserInfo,
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }
});
