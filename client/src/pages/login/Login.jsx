import React, { useRef } from "react";
import "./login.css";
import { loginCall } from "../../apiCalls";
import { useContext } from "react";
import { AuthContext } from "./../../context/AuthContext";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";

export default function Login() {
  const email = useRef();
  const password = useRef();
  const { user, isFetching, dispatch } = useContext(AuthContext);

  const handleClick = (e) => {
    e.preventDefault();

    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
  };
  console.log(user);
  console.log(isFetching);

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">BeSocial</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on BeSocial.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              type="email"
              className="loginInput"
              required
              placeholder="Email"
              ref={email}
            />
            <input
              type="password"
              className="loginInput"
              placeholder="Password"
              minLength="6"
              ref={password}
              required
            />
            <button className="loginButton" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress
                  sx={{
                    color: "white",
                  }}
                  size={22}
                />
              ) : (
                "Log In"
              )}
            </button>
            <span className="loginForgot">Forgot Password?</span>
            <Link to="/register" className="loginRegisterButton">
              {isFetching ? (
                <CircularProgress
                  sx={{
                    color: "white",
                  }}
                  size={22}
                />
              ) : (
                "Create a New Account"
              )}
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
