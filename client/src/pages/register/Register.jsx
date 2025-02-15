import React, { useRef, useState } from "react";
import "./register.css";
// import axios from "../../config/axiosConfig.js";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const navigate = useNavigate();

  const [err, setErr] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const handleClick = async (e) => {
    e.preventDefault();
    if (password.current.value !== passwordAgain.current.value) {
      setErr(true);
      setErrMessage("Passwords do not match!");
      return;
    }
    const user = {
      username: username.current.value,
      email: email.current.value,
      password: password.current.value,
    };

    try {
      await axios.post("/auth/register", user);
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);
      setErr(true);
      setErrMessage(err?.response?.data || "An unexpected error occurred");
    }
  };

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
              required
              type="text"
              ref={username}
              className="loginInput"
              placeholder="Username"
            />
            <input
              required
              type="email"
              ref={email}
              className="loginInput"
              placeholder="Email"
            />
            <input
              required
              ref={password}
              type="password"
              className="loginInput"
              placeholder="Password"
              minLength={6}
            />
            <input
              required
              ref={passwordAgain}
              type="password"
              className="loginInput"
              placeholder="Password Again"
            />
            {err && <span>{errMessage}</span>}
            <button className="loginButton" type="submit">
              Sign Up
            </button>
            <Link
              sx={{
                textDecoration: "none",
                display: "inlineBlock",
                width: "100%",
                textAlign: "center",
              }}
              to="/login"
              className="loginRegisterButton"
            >
              Log into Account
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
