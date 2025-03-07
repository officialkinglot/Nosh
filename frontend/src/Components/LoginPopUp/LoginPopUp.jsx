import React, { useContext, useState } from "react";
import "./LoginPopUp.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const LoginPopUp = ({ setShowLogin }) => {
  const { url, setToken, token } = useContext(StoreContext);
  const [currentState, setCurrentState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [notification, setNotification] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const showNotification = (message, type, autoClose = 3000) => {
    setNotification({ message, type, autoClose });
    setTimeout(() => {
      setNotification(null);
    }, autoClose);
  };

  const onLogin = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading to true
    let newUrl =
      currentState === "Login"
        ? `${url}/api/user/login`
        : `${url}/api/user/register`;
    try {
      const response = await axios.post(newUrl, data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);
        showNotification("Successfully logged in!", "success");
        setData({ name: "", email: "", password: "", phone: "" });
      } else {
        showNotification(response.data.message, "error");
      }
    } catch (error) {
      showNotification("An error occurred. Please try again.", "error");
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const onForgotPassword = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading to true
    try {
      const response = await axios.post(`${url}/api/user/forgot-password`, {
        email: data.email,
      });
      if (response.data.success) {
        showNotification("Password reset link sent to your email.", "info");
        setCurrentState("Login");
      } else {
        showNotification(response.data.message, "error");
      }
    } catch (error) {
      showNotification("An error occurred. Please try again.", "error");
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const onLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    showNotification("Successfully logged out!", "info");
  };

  return (
    <div className="login-popup">
      <form
        onSubmit={
          currentState === "Forgot Password" ? onForgotPassword : onLogin
        }
        className="login-popup-container"
      >
        <div className="login-pop-title">
          <h2>{currentState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="Close"
          />
        </div>
        <div className="login-popup-inputs">
          {currentState === "Sign Up" && (
            <>
              <input
                name="name"
                onChange={onChangeHandler}
                value={data.name}
                type="text"
                placeholder="Your name"
                required
                style={{
                  color:"blue"}}
              />
              <input
                name="phone"
                onChange={onChangeHandler}
                value={data.phone}
                type="tel"
                placeholder="Your phone number"
                required
                style={{
                  color:"green"}}
              />
            </>
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
            style={{
              color:"green"}}
          />
          {currentState !== "Forgot Password" && (
            <div className="password-input-container">
              <input
                name="password"
                onChange={onChangeHandler}
                value={data.password}
                type={visible ? "text" : "password"}
                placeholder="Your password"
                required
                style={{
                  color:"blue"}}
              />
              {visible ? (
                <AiOutlineEye
                  className="password-toggle-icon"
                  size={25}
                  onClick={() => setVisible(false)}
                />
              ) : (
                <AiOutlineEyeInvisible
                  className="password-toggle-icon"
                  size={25}
                  onClick={() => setVisible(true)}
                />
              )}
            </div>
          )}
        </div>
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? (
            <div className="loader-container">
              <div className="loader"></div>
              <span>Please wait</span>
            </div>
          ) : currentState === "Sign Up"
            ? "Create account"
            : currentState === "Forgot Password"
            ? "Reset Password"
            : "Login"}
        </button>
        {currentState === "Login" && (
          <p>
            <span onClick={() => setCurrentState("Forgot Password")}>
              Forgot Password?
            </span>
          </p>
        )}
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p> By continuing, I agree to the terms of use & policy</p>
        </div>
        {currentState === "Login" ? (
          <p>
            Want a new account?{" "}
            <span onClick={() => setCurrentState("Sign Up")}>Click Here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrentState("Login")}>Login</span>
          </p>
        )}
      </form>
      {notification && (
        <div
          className={`notification ${notification.type}`}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "15px",
            borderRadius: "5px",
            color: "white",
            fontSize: "16px",
            zIndex: 1000,
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            backgroundColor:
              notification.type === "success"
                ? "#4caf50"
                : notification.type === "error"
                ? "#f44336"
                : notification.type === "info"
                ? "#2196f3"
                : "#4caf50",
          }}
        >
          {notification.message}
        </div>
      )}
      {token && (
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      )}
    </div>
  );
};

export default LoginPopUp;
