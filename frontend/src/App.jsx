import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Pages/Home/Home";
import Cart from "./Pages/Cart/Cart";
import ResetPassword from "./Components/ResetPassword/ResetPassword";
import PlaceOrder from "./Pages/PlaceOrder/PlaceOrder";
import Footer from "./Components/Footer/Footer";
import LoginPopUp from "./Components/LoginPopUp/LoginPopUp";
import Verify from "./Pages/Verify/Verify";
import MyOrders from "./Pages/MyOrders/Myorders.jsx";
import BookHall from "./Pages/Hall/Hall"; // Adjust the import path as needed
import StoreContextProvider from "./Context/StoreContext"; // Adjust the import path as needed
import VerifyHallBooking from "./Pages/VerifyHallBooking/VerifyHallBooking";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [category, setCategory] = useState("All");

  return (
    <StoreContextProvider>
      <>
        {showLogin && <LoginPopUp setShowLogin={setShowLogin} />}
        <div className="app">
          <Navbar setShowLogin={setShowLogin} category={category} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/reset-password" element={<ResetPassword setShowLogin={setShowLogin} />} />
            <Route path="/order" element={<PlaceOrder />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/myorders" element={<MyOrders />} />
            <Route path="/book-hall" element={<BookHall />} /> {/* Add the BookHall route */}
            <Route path="/verify-hall" element={<VerifyHallBooking />} /> {/* Add the VerifyHallBooking route */}
          </Routes>
        </div>
        <Footer />
      </>
    </StoreContextProvider>
  );
};

export default App;
