import axios from "axios";

const API_ORIGIN = process.env.REACT_APP_API_URL;

// Create an Axios instance with a base URL
const instance = axios.create({
  baseURL: `${API_ORIGIN}/api`,
  withCredentials: true
});

export default instance;
