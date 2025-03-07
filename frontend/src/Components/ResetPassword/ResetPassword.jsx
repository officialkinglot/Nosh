import React, { useState } from "react";
import "./ResetPassword.css";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const ResetPassword = ({ setShowLogin }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/user/reset-password`,
        { token, password }
      );
      if (response.data.success) {
        setMessage("Password has been reset successfully, You can now Login.");
        setTimeout(() => {
          setShowLogin(true);
          navigate("/login");
        }, 5000);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage("Please try again.");
    }
  };

  return (
    <div className="reset-password-container">
      <form onSubmit={handleSubmit} className="reset-password-form">
        <h2>Reset Password</h2>
        {message && <p>{message}</p>}

        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="toggle-password-visibility"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="password-input-container">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="toggle-password-visibility"
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button className="submit" type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
