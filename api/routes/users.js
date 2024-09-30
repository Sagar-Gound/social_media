import { Router } from "express";

export const usersRoute = Router();

usersRoute.get("/", (req,res)=>{
  res.send({
    "message":"Hello World"
  })
})