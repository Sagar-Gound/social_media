import { createContext, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
  // user: {
  //   _id: "67014a57f29a02cddd7da803",
  //   username: "Pratham",
  //   email: "pratham@gmail.com",
  //   profilePicture: "",
  //   coverPicture: "",
  //   followers: ["67014a3ff29a02cddd7da800"],
  //   followings: ["67014a3ff29a02cddd7da800", "67014bdc857a6cd594869c55"],
  // },
  user: null,
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
