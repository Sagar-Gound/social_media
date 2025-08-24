import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers.cookie?.split("authToken=")[1];

  if (!token) {
    return res.status(401).json({
      message: "Access denied!",
      success: false
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log({ decoded });
    return next();
  } catch (error) {
    return res.status(403).json({
      message: "Unauthorized access",
      success: false
    });
  }
};  