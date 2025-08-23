import React, { useState } from "react";
import "./register.css";
import axios from "../../config/axiosConfig.js";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock, 
  Person,
  CheckCircle 
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError("");
    
    const { confirmPassword, ...submitData } = data;
    
    try {
      await axios.post("/auth/register", submitData);
      reset();
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);
      setServerError(err?.response?.data?.error || err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="register">
      <div className="registerWrapper">
        <div className="registerLeft">
          <h3 className="registerLogo">BeSocial</h3>
          <span className="registerDesc">
            Join the community and connect with friends around the world.
          </span>
          <div className="registerFeatures">
            <div className="feature">
              <CheckCircle className="featureIcon" />
              <span>Connect with friends</span>
            </div>
            <div className="feature">
              <CheckCircle className="featureIcon" />
              <span>Share your moments</span>
            </div>
            <div className="feature">
              <CheckCircle className="featureIcon" />
              <span>Discover new content</span>
            </div>
          </div>
        </div>
        <div className="registerRight">
          <div className="registerBox">
            <h2 className="registerTitle">Create Account</h2>
            <p className="registerSubtitle">Join us today and start connecting</p>
            
            <form className="registerForm" onSubmit={handleSubmit(onSubmit)}>
              <div className="inputGroup">
                <div className="inputWithIcon">
                  <Person className="inputIcon" />
                  <input
                    type="text"
                    className={`registerInput ${errors.username ? 'error' : ''}`}
                    placeholder="Username"
                    {...register("username", {
                      required: "Username is required",
                      minLength: {
                        value: 3,
                        message: "Username must be at least 3 characters"
                      },
                      maxLength: {
                        value: 20,
                        message: "Username must be less than 20 characters"
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9_]+$/,
                        message: "Username can only contain letters, numbers, and underscores"
                      }
                    })}
                  />
                </div>
                {errors.username && <span className="errorMessage">{errors.username.message}</span>}
              </div>

              <div className="inputGroup">
                <div className="inputWithIcon">
                  <Email className="inputIcon" />
                  <input
                    type="email"
                    className={`registerInput ${errors.email ? 'error' : ''}`}
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
                    className={`registerInput ${errors.password ? 'error' : ''}`}
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

              <div className="inputGroup">
                <div className="inputWithIcon">
                  <Lock className="inputIcon" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className={`registerInput ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Confirm password"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match"
                    })}
                  />
                  <div 
                    className="passwordToggle" 
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </div>
                </div>
                {errors.confirmPassword && <span className="errorMessage">{errors.confirmPassword.message}</span>}
              </div>

              {serverError && (
                <div className="registerError">
                  {serverError}
                </div>
              )}

              <button 
                className="registerButton" 
                type="submit" 
                disabled={isLoading || !isValid}
              >
                {isLoading ? (
                  <CircularProgress
                    sx={{ color: "white" }}
                    size={22}
                  />
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="divider">
              <span>Already have an account?</span>
            </div>

            <Link to="/login" className="registerLoginButton">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
