import axios from "axios";

// Create an Axios instance with a base URL
const instance = axios.create({
  baseURL: "https://social-media-eyt0.onrender.com/api",
  withCredentials: true
});

export default instance;
