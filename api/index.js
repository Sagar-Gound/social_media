import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

// import Routes
import { authRoute, usersRoute } from "./routes/index.js";

const PORT = process.env.PORT || 4000;

dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Connected to MongoDB");
});

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(helmet());
app.use(morgan("common"));

// register Routes
app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
