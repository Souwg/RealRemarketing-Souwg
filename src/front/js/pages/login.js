import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../../styles/login.css";

export const Login = () => {
  const { actions, store } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await actions.loginUser(email, password);
    if (response.token) {
      localStorage.setItem("token", response.token);
    }
    if (response.success) {
      navigate(response.is_admin ? "/admin " : "/user");
    } else {
      setError(response.msg);
      setEmail("");
      setIsModalOpen(true);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form">
        <h2 className="login-title">Login</h2>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            placeholder="Enter your email"
          />
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            placeholder="Enter your password"
          />
        </div>

        {/* Forgot Password */}
        <div className="form-group">
          <a
            href="#"
            className="form-label"
            style={{ fontSize: "14px", textAlign: "right", display: "block" }}
          >
            Forgot Password?
          </a>
        </div>

        {/* Login Button */}
        <button type="submit" className="btn-login">
          Login
        </button>

        {/* Register Section */}
        <div className="form-group register-section">
          <p className="register-text">
            Don't have an account?{" "}
            <a
              href="/register"
              className="register-link"
              style={{ color: "blue", textDecoration: "underline" }}
            >
              Register here
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};
