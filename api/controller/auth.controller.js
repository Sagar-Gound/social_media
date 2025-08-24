import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
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
}

export const loginUser = async (req, res) => {
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

      const payload = {
        id: user._id,
        name: user.username,
        email: user.email
      };

      // generate JWT token
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: '1h'
      });

      res.cookie("authToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 1000 // 1 hour same as JWT token expiration
      });

      return res.status(200).json({
        message: "User logged in successfully",
        filteredUserInfo,
        token
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }
}

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return res.status(200).json({
      message: "User logged out successfully",
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error logging out",
      error: error.message,
      success: false
    })
  }
}