import React, { useState } from "react";
import axios from "axios";
import { url } from "../../App";
import assets from "../../assets/bag_icon.png"; // Replace with the actual path
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "./DispatchLogin.css";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid'; // Import uuid to generate unique IDs

const Login = ({ handleLogin }) => {
  const [isAdmin, setIsAdmin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const dispatchEmail = import.meta.env.VITE_DISPATCH_EMAIL || "";
  const dispatchPassword = import.meta.env.VITE_DISPATCH_PASSWORD || "";

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isAdmin
        ? `${url}/api/admin/admin-login`
        : `${url}/api/admin/dispatch-login`; // Correct endpoint
      const data = isAdmin
        ? { email, password }
        : { name, phone, email, password };

      const response = await axios.post(endpoint, data);
      console.log("API Response:", response.data); // Log the API response for debugging

      if (response.data.success) {
        handleLogin(isAdmin); // Pass the login type to handleLogin
        if (!isAdmin) {
          const uniqueId = uuidv4(); // Generate a unique ID
          localStorage.setItem("dispatchName", name);
          localStorage.setItem("dispatchPhone", phone);
          localStorage.setItem("dispatchId", uniqueId);
        }
      } else if (response.data.message === 'Dispatch rider does not exist' && email === dispatchEmail && password === dispatchPassword) {
        // Grant access even if the dispatch rider does not exist
        handleLogin(false); // Pass the login type to handleLogin
        const uniqueId = uuidv4(); // Generate a unique ID
        localStorage.setItem("dispatchName", name);
        localStorage.setItem("dispatchPhone", phone);
        localStorage.setItem("dispatchId", uniqueId);
      } else {
        alert("Invalid Email or Password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        alert("An error occurred during login: " + error.response.data.message);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        alert("An error occurred during login: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
        alert("An error occurred during login: " + error.message);
      }
    }
  };

  const handleToggle = (isAdmin) => {
    setIsAdmin(isAdmin);
    if (!isAdmin) {
      setEmail(dispatchEmail);
      setPassword(dispatchPassword);
    } else {
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="login-container">
      {/* Logo */}
      <a href="http://localhost:5173/">
        <img
          src={assets}
          alt="App Logo"
          className="logo"
        />
      </a>

      <h1>{isAdmin ? "Admin Login" : "Dispatch Login"}</h1>

      <form onSubmit={onSubmitHandler} className="login-form">
        {!isAdmin && (
          <>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group password-field">
          <label>Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {showPassword ? (
            <AiOutlineEyeInvisible
              className="password-toggle-icon"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <AiOutlineEye
              className="password-toggle-icon"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>

        <button type="submit" className="submit-button">
          Login
        </button>

        <div className="toggle-container">
          <span
            className={`toggle-text ${isAdmin ? "active" : ""}`}
            onClick={() => handleToggle(true)}
          >
            <strong>Admin</strong>
          </span>
          <span> | </span>
          <span
            className={`toggle-text ${!isAdmin ? "active" : ""}`}
            onClick={() => handleToggle(false)}
          >
            <strong>Dispatch</strong>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
