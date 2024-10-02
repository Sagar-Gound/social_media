import mongoose from "mongoose";

// Middleware to check if the ID is a valid ObjectId
const checkObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json("Invalid user ID");
  }
  next();
};

export { checkObjectId };