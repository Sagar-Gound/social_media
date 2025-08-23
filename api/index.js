import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors"

// import Routes
import { authRoute, userRoute, postRoute, uploadRoute } from "./routes/index.js";

const PORT = process.env.PORT || 4000;

dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Connected to MongoDB");
});

const app = express();

// middlewares
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(morgan("common"));

// Serve static files
app.use('/images', express.static('public/images'));

// register Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/upload", uploadRoute);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
