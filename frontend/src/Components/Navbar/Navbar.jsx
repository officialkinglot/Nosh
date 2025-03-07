 import React, { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import Search from "../Search/Search"; // Import the Search component

const Navbar = ({ setShowLogin, category }) => {
  const [menu, setMenu] = useState("home");
  const [notification, setNotification] = useState(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);

  const { getTotalCartAmount, token, setToken, food_list } = useContext(StoreContext);

  const navigate = useNavigate();

  const showNotification = (message, type, autoClose = 3000) => {
    setNotification({ message, type, autoClose });
    setTimeout(() => {
      setNotification(null);
    }, autoClose);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    showNotification("Logged out successfully!", "info");
    navigate("/");
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    const filteredProducts =
      food_list &&
      food_list.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase()) &&
        (category === "All" || category === product.category) &&
        product.isAvailable // Ensure the item is available
      );
    setSearchData(filteredProducts);
  };

  const handleLogoClick = () => {
    setIsSearchVisible(false);
    navigate("/");
  };

  const handleHomeClick = () => {
    setIsSearchVisible(false);
    setMenu("home");
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link to="/" onClick={handleLogoClick}>
        <img src={assets.bag_icon} className="logo" alt="" />
      </Link>
      {isSearchVisible ? (
        <div className="search-container">
          <Search
            category={category}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            searchData={searchData}
          />
          <img
            src={assets.cross_icon}
            alt="Close"
            className="navbar-search-icon"
            onClick={toggleSearch}
          />
        </div>
      ) : (
        <>
          <ul className="navbar-menu">
            <Link
              to={"/"}
              onClick={handleHomeClick}
              className={menu === "home" ? "active" : ""}
            >
              Home
            </Link>
            <a
              href="#explore-menu"
              onClick={() => setMenu("menu")}
              className={menu === "menu" ? "active" : ""}
            >
              Menu
            </a>
            <a
              href="#app-download"
              onClick={() => setMenu("mobile-app")}
              className={menu === "mobile-app" ? "active" : ""}
            >
              Our-App
            </a>
            <a
              href="#footer" // Corrected anchor link to "#footer"
              onClick={() => setMenu("Contact-us")}
              className={menu === "Contact-us" ? "active" : ""}
            >
              Contact-Us
            </a>
          </ul>
          <div className="navbar-right">
            <img
              src={assets.search_icon}
              alt="Search"
              className="navbar-search-icon"
              onClick={toggleSearch}
            />
            <div className="navbar-search-icon">
              <Link to="/cart">
                {" "}
                <img src={assets.basket_icon} alt="" />
              </Link>
              <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
            </div>
            {!token ? (
              <button onClick={() => setShowLogin(true)}> Sign in</button>
            ) : (
              <div className="navbar-profile">
                <img src={assets.profile_icon} alt="" />
                <ul className="nav-profile-dropdown">
                  <li onClick={() => navigate("/myorders")}>
                    <img src={assets.bag_icon} alt="" />
                    <p> Orders </p>
                  </li>
                  <hr />
                  <li onClick={logout}>
                    {" "}
                    <img src={assets.logout_icon} alt="" />
                    <p>Logout</p>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </>
      )}
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
    </div>
  );
};

export default Navbar;
