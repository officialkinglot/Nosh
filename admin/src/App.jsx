/* eslint-disable no-unused-vars */
 // App.jsx
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Add from "./pages/Add/Add";
import Orders from "./pages/Orders/Orders";
import List from "./pages/List/List";
import ChangeDeliveryFee from "./pages/DeliveryFee/DeliveryFee";
import PendingOrders from "./pages/PendingOrders/PendingOrders";
import DeliveredOrders from "./pages/DeliveredOrders/DeliveredOrders";
import AllStaff from "./pages/AllStaffs/AllStaffs";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login";
import DispatchMenu from "./pages/DispatchMenu/DispatchMenu";
import AdminDispatchMenu from "./pages/AdminDispatchMenu/AdminDispatchMenu";
import HallBookings from "./pages/HallBookings/BookedHall";
import UpdateHallPrices from "./pages/UpdateHallPrices/UpdateHallPrices";
import BookedHall from "./pages/HallBookings/BookedHall";
import Events from "./pages/Events/Events";
import axios from "axios";
import { toast } from "react-toastify";
import { orderBy } from "lodash";
import PromoCodes from "./pages/PromoCodes/PromoCodes.jsx"; // Import the PromoCodes component

export const url = "http://localhost:4000";

const App = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isDispatchLoggedIn, setIsDispatchLoggedIn] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [dispatchName, setDispatchName] = useState("");
  const [dispatchPhone, setDispatchPhone] = useState("");
  const [dispatchSessionId, setDispatchSessionId] = useState("");
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const adminLoggedInStatus = sessionStorage.getItem("isAdminLoggedIn");
    const dispatchLoggedInStatus = sessionStorage.getItem("isDispatchLoggedIn");
    const adminName = sessionStorage.getItem("adminName");
    const adminPhone = sessionStorage.getItem("adminPhone");
    const dispatchName = sessionStorage.getItem("dispatchName");
    const dispatchPhone = sessionStorage.getItem("dispatchPhone");
    const dispatchSessionId = sessionStorage.getItem("dispatchSessionId");
    if (adminLoggedInStatus === "true" && adminName && adminPhone) {
      setIsAdminLoggedIn(true);
      setAdminName(adminName);
      setAdminPhone(adminPhone);
    }
    if (dispatchLoggedInStatus === "true" && dispatchName && dispatchPhone && dispatchSessionId) {
      setIsDispatchLoggedIn(true);
      setDispatchName(dispatchName);
      setDispatchPhone(dispatchPhone);
      setDispatchSessionId(dispatchSessionId);
    }
    fetchEventBookings();
  }, []);

  const handleLogin = (isAdmin, name, phone, sessionId) => {
    if (isAdmin) {
      setIsAdminLoggedIn(true);
      setAdminName(name);
      setAdminPhone(phone);
      sessionStorage.setItem("isAdminLoggedIn", "true");
      sessionStorage.setItem("adminName", name);
      sessionStorage.setItem("adminPhone", phone);
      navigate("/orders");
    } else {
      setIsDispatchLoggedIn(true);
      setDispatchName(name);
      setDispatchPhone(phone);
      setDispatchSessionId(sessionId);
      sessionStorage.setItem("isDispatchLoggedIn", "true");
      sessionStorage.setItem("dispatchName", name);
      sessionStorage.setItem("dispatchPhone", phone);
      sessionStorage.setItem("dispatchSessionId", sessionId);
      navigate("/dispatch-menu");
    }
  };

  const handleLogout = (isAdmin) => {
    if (isAdmin) {
      setIsAdminLoggedIn(false);
      setAdminName("");
      setAdminPhone("");
      sessionStorage.removeItem("isAdminLoggedIn");
      sessionStorage.removeItem("adminName");
      sessionStorage.removeItem("adminPhone");
    } else {
      setIsDispatchLoggedIn(false);
      setDispatchName("");
      setDispatchPhone("");
      setDispatchSessionId("");
      sessionStorage.removeItem("isDispatchLoggedIn");
      sessionStorage.removeItem("dispatchName");
      sessionStorage.removeItem("dispatchPhone");
      sessionStorage.removeItem("dispatchSessionId");
    }
    navigate("/");
  };

  const fetchEventBookings = async () => {
    try {
      const response = await axios.get(`${url}/api/events/list`);
      if (response.data.success) {
        const sortedEvents = orderBy(response.data.data, ["createdAt"], ["desc"]);
        setEvents(sortedEvents);
      } else {
        toast.error("Error fetching events");
      }
    } catch (error) {
      toast.error("Error fetching events");
    }
  };

  const url = "http://localhost:4000";
  return (
    <div>
      {!isAdminLoggedIn && !isDispatchLoggedIn ? (
        <Login handleLogin={handleLogin} />
      ) : (
        <>
          <ToastContainer />
          <Navbar
            handleLogout={handleLogout}
            adminName={adminName}
            adminPhone={adminPhone}
            dispatchName={dispatchName}
            dispatchPhone={dispatchPhone}
            isAdminLoggedIn={isAdminLoggedIn}
            isDispatchLoggedIn={isDispatchLoggedIn}
          />
          <hr />
          <div className="app-content">
            {isAdminLoggedIn && <Sidebar />}
            <Routes>
              {isAdminLoggedIn && (
                <>
                  <Route path="/add" element={<Add url={url} />} />
                  <Route path="/list" element={<List url={url} />} />
                  <Route path="/orders" element={<Orders url={url} events={events} setEvents={setEvents} />} />
                  <Route path="/pending-orders" element={<PendingOrders url={url} />} />
                  <Route path="/delivered-orders" element={<DeliveredOrders url={url} />} />
                  <Route path="/change-delivery-fee" element={<ChangeDeliveryFee />} />
                  <Route path="/admin-dispatch-menu" element={<AdminDispatchMenu />} />
                  <Route path="/all-staffs" element={<AllStaff />} />
                  <Route path="/hall-bookings" element={<HallBookings />} />
                  <Route path="/update-hall-prices" element={<UpdateHallPrices />} />
                  <Route path="/booked-hall" element={<BookedHall />} />
                  <Route path="/events" element={<Events events={events} setEvents={setEvents} />} />
                  <Route path="/promo-codes" element={<PromoCodes />} /> {/* Add the PromoCodes route */}
                </>
              )}
              {isDispatchLoggedIn && (
                <>
                  <Route path="/dispatch-menu" element={<DispatchMenu />} />
                  <Route path="/book-hall" element={<BookedHall />} />
                </>
              )}
              <Route path="*" element={<Navigate to={isAdminLoggedIn ? "/orders" : "/dispatch-menu"} />} />
            </Routes>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
