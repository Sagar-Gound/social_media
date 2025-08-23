import axios from "./config/axiosConfig";

export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post("/auth/login", userCredential);    
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data.filteredUserInfo });
    // Store user in localStorage for persistence
    localStorage.setItem("user", JSON.stringify(res.data.filteredUserInfo));
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err.response?.data?.message || err.message });
  }
};

export const logoutCall = (dispatch) => {
  try {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
    // Clear any other stored data if needed
    localStorage.removeItem("authToken");
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
};
