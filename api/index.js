import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors"

// import Routes
import { authRoute, userRoute, postRoute, uploadRoute } from "./routes/index.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Connected to MongoDB");
});

const app = express();

// middlewares
app.use(cors({
  origin: ["http://localhost:3000", "https://be-social-beings.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.options("*", cors());
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
