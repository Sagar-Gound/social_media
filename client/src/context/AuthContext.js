import { createContext, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
  user: {
    // _id: "63ab01601709b627b39f47c5",
    // username: "Pratham",
    // email: "pratham@gmail.com",
    // profilePicture: "profile/PP1.jpeg",
    // coverPicture: "",
    // followers: ["63ae8411808ac80f007e2138", "63abed717b8433eb71777156"],
    // followings: ["63abed717b8433eb71777156", "63ae8411808ac80f007e2138"],
    _id: null,
    username: "",
    email: "",
    profilePicture: "",
    coverPicture: "",
    followers: [],
    followings: [],
  },
  isFetching: false,
  error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
