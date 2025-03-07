import React, { useState, useEffect } from 'react';
import './AdminNavbar.css';
import { assets } from "../../assets/assets";
import { Link } from 'react-router-dom';

const AdminNavbar = ({ handleLogout, adminName, adminPhone, dispatchName, dispatchPhone, isAdminLoggedIn, isDispatchLoggedIn }) => {
  const name = isAdminLoggedIn ? adminName : dispatchName;
  const phone = isAdminLoggedIn ? adminPhone : dispatchPhone;
  const lastLogin = sessionStorage.getItem("lastLogin");
  const lastLogout = sessionStorage.getItem("lastLogout");
  const isOnline = true; // Replace with actual logic to determine if the user is online

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);
    return () => clearInterval(timerID);
  }, []);

  const tick = () => {
    const now = new Date();
    const nigerianTime = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Lagos" }));
    setCurrentTime(nigerianTime);
  };

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString('en-GB', { month: 'short' });
    const year = date.getFullYear();

    const suffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };

    return `${day}${suffix(day)} ${month} ${year}`;
  };

  return (
    <div className="admin-navbar">
      <Link to="/" className="admin-navbar-logo">
        <img className="admin-logo" src={assets.bag_icon} alt="Logo" />
        <span className="admin-app-name">{isAdminLoggedIn ? "Admin Panel" : "Dispatch Panel"}</span>
      </Link>
      <div className="admin-user-info">
        <p className="admin-user-name">👤 {name || "User"}</p>
        <p className="admin-user-phone"> 📞 {phone || "N/A"}</p>
        <p className="admin-user-status"> : {isOnline ? "Online" : "Offline"}</p>
        {!isOnline && (
          <>
            <p className="admin-user-last-login">
              Last Login: {lastLogin ? new Date(lastLogin).toLocaleString() : "N/A"}
            </p>
            <p className="admin-user-last-logout">
              Last Logout: {lastLogout ? new Date(lastLogout).toLocaleString() : "N/A"}
            </p>
          </>
        )}
      </div>
      <div className="admin-navbar-right">
        <div className="admin-current-time">
        🕒{formatDate(currentTime)} {currentTime.toLocaleString("en-GB", { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
        <img className="admin-profile" src={assets.profile_icon} alt="Profile Icon" />
        <button className="admin-logout-button" onClick={() => handleLogout(isAdminLoggedIn)}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;
