import { useEffect } from "react";
import "./login.css";
import { loginCall } from "../../apiCalls";
import { useContext } from "react";
import { AuthContext } from "./../../context/AuthContext";
import { CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { user, isFetching, error, dispatch } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: ""
    }
  });

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    await loginCall(data, dispatch);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          <div className="loginBox">
            <h2 className="loginTitle">Welcome Back</h2>
            <p className="loginSubtitle">Please sign in to your account</p>
            
            <form className="loginForm" onSubmit={handleSubmit(onSubmit)}>
              <div className="inputGroup">
                <div className="inputWithIcon">
                  <Email className="inputIcon" />
                  <input
                    type="email"
                    className={`loginInput ${errors.email ? 'error' : ''}`}
                    placeholder="Email address"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                  />
                </div>
                {errors.email && <span className="errorMessage">{errors.email.message}</span>}
              </div>

              <div className="inputGroup">
                <div className="inputWithIcon">
                  <Lock className="inputIcon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`loginInput ${errors.password ? 'error' : ''}`}
                    placeholder="Password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      }
                    })}
                  />
                  <div 
                    className="passwordToggle" 
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </div>
                </div>
                {errors.password && <span className="errorMessage">{errors.password.message}</span>}
              </div>

              {error && (
                <div className="loginError">
                  {typeof error === 'string' ? error : 'Login failed. Please try again.'}
                </div>
              )}

              <button 
                className="loginButton" 
                type="submit" 
                disabled={isFetching || !isValid}
              >
                {isFetching ? (
                  <CircularProgress
                    sx={{ color: "white" }}
                    size={22}
                  />
                ) : (
                  "Sign In"
                )}
              </button>

              <span className="loginForgot">Forgot Password?</span>
            </form>

            <div className="divider">
              <span>Don't have an account?</span>
            </div>

            <Link to="/register" className="loginRegisterButton">
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
