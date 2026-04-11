import axios from "axios";

const API_ORIGIN = process.env.REACT_APP_API_URL || "http://localhost:4000";

// Create an Axios instance with a base URL
const instance = axios.create({
  baseURL: `${API_ORIGIN}/api`,
  withCredentials: true
});

export default instance;
