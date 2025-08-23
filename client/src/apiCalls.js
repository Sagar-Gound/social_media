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

export const getAllUsers = async () => {
  try {
    const res = await axios.get("/users/all");
    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const followUser = async (userId, currentUserId) => {
  try {
    const res = await axios.put(`/users/${userId}/follow`, {
      userId: currentUserId
    });
    return res.data;
  } catch (error) {
    console.error("Error following user:", error);
    throw error;
  }
};

export const unfollowUser = async (userId, currentUserId) => {
  try {
    const res = await axios.put(`/users/${userId}/unfollow`, {
      userId: currentUserId
    });
    return res.data;
  } catch (error) {
    console.error("Error unfollowing user:", error);
    throw error;
  }
};

export const getAllFriends = async (userId) => {
  try {
    const response = await axios.get(`/users/${userId}/friends`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching friends:", error);
    return { 
      success: false, 
      error: error.response?.data?.message || "Failed to fetch friends" 
    };
  }
};
