import { Router } from "express";

export const userRoute = Router();

// get a user
userRoute.get("/", (req, res) => {

  res.send({
    message: "Hello World",
  });
});
