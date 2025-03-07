 // components/Sidebar/Sidebar.jsx
import React from 'react';
import "./Sidebar.css";
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const isAdmin = localStorage.getItem("userRole") === "admin";

  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        {isAdmin && (
          <>
            <NavLink to="/add" className="sidebar-option">
              <img src={assets.add_icon_white} alt="Add Items" />
              <p>Add Items</p>
            </NavLink>
            <NavLink to="/list" className="sidebar-option">
              <img src={assets.icons11} alt="List Items" />
              <p>Food Lists</p>
            </NavLink>
            <NavLink to="/orders" className="sidebar-option">
              <img src={assets.icons10} alt="Orders" />
              <p>Orders</p>
            </NavLink>
            <NavLink to="/pending-orders" className="sidebar-option">
              <img src={assets.pending} alt="Pending Orders" />
              <p>Pending Orders</p>
            </NavLink>
            <NavLink to="/delivered-orders" className="sidebar-option">
              <img src={assets.delivered} alt="Delivered Orders" />
              <p>Delivered Orders</p>
            </NavLink>
            <NavLink to="/change-delivery-fee" className="sidebar-option">
              <img src={assets.icons9} alt="Change Delivery Fee" />
              <p>Change Delivery Fee</p>
            </NavLink>
            <NavLink to="/admin-dispatch-menu" className="sidebar-option">
              <img src={assets.icons8} alt="Dispatcher Activities" />
              <p>Dispatcher Activities</p>
            </NavLink>
            <NavLink to="/hall-bookings" className="sidebar-option">
              <img src={assets.hall} alt="Hall Bookings" />
              <p>Hall Bookings</p>
            </NavLink>
            <NavLink to="/update-hall-prices" className="sidebar-option">
              <img src={assets.price} alt="Update Hall Prices" />
              <p>Update Hall Price</p>
            </NavLink>
            <NavLink to="/promo-codes" className="sidebar-option">
              <img src={assets.promo} alt="Promo Codes" />
              <p>Promo Codes</p>
            </NavLink>
          </>
        )}
        {!isAdmin && (
          <>
            <NavLink to="/dispatch-menu" className="sidebar-option">
              <img src={assets.icons8} alt="Dispatch Menu" />
              <p>Dispatch Menu</p>
            </NavLink>
            <NavLink to="/book-hall" className="sidebar-option">
              <img src={assets.book_hall_icon} alt="Book Hall" />
              <p>Book Hall</p>
            </NavLink>
          </>
        )}
        <NavLink to="/events" className="sidebar-option">
          <img src={assets.events} alt="Events" />
          <p>Events</p>
        </NavLink>
        <NavLink to="/all-staffs" className="sidebar-option">
          <img src={assets.workers} alt="All Staffs" />
          <p>All Staffs</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
