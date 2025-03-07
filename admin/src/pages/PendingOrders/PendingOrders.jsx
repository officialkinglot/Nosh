 import React, { useState, useEffect, useContext } from "react";
import "./PendingOrders.css"; // Import styles
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../../../frontend/src/Context/StoreContext";
import moment from 'moment-timezone';
import { orderBy } from 'lodash'; // Import Lodash orderBy function

const formatDateTime = (dateString) => {
  return moment.tz(dateString, 'Africa/Lagos').format("MMMM Do, YYYY [at] h:mm A");
};

const PendingOrders = () => {
  const { url } = useContext(StoreContext);
  const [pendingOrders, setPendingOrders] = useState([]);

  const fetchPendingOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        // Filter and sort orders that are "Food Order Processing" or "Out For Delivery"
        const filteredOrders = response.data.data.filter(order =>
          order.status === "Food Order Processing" || order.status === "Out For Delivery"
        );
        const sortedOrders = orderBy(filteredOrders, ['createdAt'], ['desc']);
        setPendingOrders(sortedOrders);
      } else {
        toast.error("Error fetching pending orders");
      }
    } catch (error) {
      toast.error("Error fetching pending orders");
    }
  };

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  return (
    <div className="pending-orders">
      <h1>Pending Orders</h1>
      <div className="order-list">
        {pendingOrders.length > 0 ? (
          pendingOrders.map((order) => (
            <div key={order._id} className="order-item">
              <div className="order-item-header">
                <p className="order-item-name">
                  {order.address ? `${order.address.firstName} ${order.address.lastName}` : 'Address not available'}
                </p>
                <span className="order-item-phone">
                  {order.address ? `${order.address.phone}📞☎️📱` : 'Phone not available'}
                </span>
              </div>
              <div className="order-item-address">
                {order.address ? (
                  <>
                    <p>{order.address.street}</p>
                    <p>{order.address.city}, {order.address.state}</p>
                  </>
                ) : (
                  <p>Address not available</p>
                )}
              </div>
              <div className="order-item-food">
                <div className="order-item-food2">
                  {order.items.map((item, itemIndex) => (
                    <span key={itemIndex} className="food-item">
                      {item.name} X {item.quantity}
                    </span>
                  ))}
                </div>
              </div>
              <div className="order-item-details">
                <p className="item-price">
                  {order.amount.toLocaleString("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })}
                </p>
                <p className="item-item">Items: {order.items.length}</p>
                <p className="order-item-date">
                  Ordered on: {formatDateTime(order.createdAt)}
                </p>
                <p className="order-item-status">
                  Status: {order.status}
                </p>
              </div>
              {order.status === "Out For Delivery🚚" && order.dispatcher && (
                <div className="dispatcher-info">
                  <p>Order picked by: {order.dispatcher.name}</p>
                  <p>Dispatcher ID: {order.dispatcher.id}</p>
                  <p>Dispatcher Phone: {order.dispatcher.phone}</p>
                  <p>Pickup Time: {formatDateTime(order.pickupTime)}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-orders-message">
            <p style={{ color: 'red' }}>No pending orders!</p>
            <p style={{ color: 'green' }}>Enjoy your break!</p>
            <p style={{ color: 'blue' }}>Rest and recharge!</p>
            <p style={{ color: 'purple' }}>You deserve it!</p>
            <p style={{ color: 'orange' }}>Keep up the good work!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingOrders;
