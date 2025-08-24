import axios from "axios";

// Create an Axios instance with a base URL
const instance = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true
});

export default instance;
