import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const cookieHeader = req.headers.cookie || "";
  const cookieToken = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("authToken="))
    ?.split("=")[1];

  const authHeader = req.headers.authorization || "";
  const bearerToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  const token = cookieToken || bearerToken;

  if (!token) {
    return res.status(401).json({
      message: "Access denied!",
      success: false
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(403).json({
      message: "Unauthorized access",
      success: false
    });
  }
};  