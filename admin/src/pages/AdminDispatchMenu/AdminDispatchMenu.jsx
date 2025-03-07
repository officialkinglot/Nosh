import React, { useState, useEffect, useContext } from "react";
import "../DispatchMenu/DispatchMenu.css"; // Import styles
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import axios from "axios";
import { StoreContext } from "../../../../frontend/src/Context/StoreContext";
import moment from "moment-timezone";

const AdminDispatchMenu = () => {
  const { url } = useContext(StoreContext); // Backend URL from context
  const [orders, setOrders] = useState([]);

  // Fetch all orders
  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        // Sort orders by creation date (latest first)
        const sortedOrders = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      toast.error("Error fetching orders");
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="dispatch-menu">
      <h3>Dispatcher Activities</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            {/* Order Details */}
            <div>
              <p className="order-item-name">
                {order.address.firstName} {order.address.lastName}
              </p>
              <div className="order-item-address">
                <p>{order.address.street}</p>
                <p>
                  {order.address.city}, {order.address.state}
                </p>
              </div>
              <span className="order-item-phone">{order.address.phone} 📞</span>
            </div>

            {/* Parcel Icon with Item Names Below */}
            <div className="order-item-food">
              <img
                src={assets.parcel_icon}
                alt="Parcel Icon"
                className="food-item-image"
              />
              <p className="item-item">
                Items: {order.items.length}
              </p>
              <div className="food-item-names">
                {order.items.map((item, itemIndex) => (
                  <span key={itemIndex} className="food-item">
                    {item.name}
                    {itemIndex < order.items.length - 1 ? "," : ""}
                    <br /> {/* New line after each item */}
                  </span>
                ))}
              </div>
            </div>

            {/* Total Price */}
            <div className="order-total">
              <p>Total Price: ₦{order.amount.toLocaleString("en-NG")}</p>
            </div>

            {/* Order Status */}
            <p className="order-status">Status: {order.status}</p>

            {/* Ordered on Date */}
            <p className="order-item-date">
              Ordered on:{" "}
              {moment
                .tz(order.createdAt, "Africa/Lagos")
                .format("MMM Do, YYYY [at] h:mm A")}
            </p>

            {/* Pickup Time */}
            {order.pickupTime && (
              <p className="order-item-date">
                Pickup Time:{" "}
                {moment
                  .tz(order.pickupTime, "Africa/Lagos")
                  .format("MMM Do, YYYY [at] h:mm A")}
              </p>
            )}

            {/* Delivery Time */}
            {order.deliveryTime && (
              <p className="order-item-date">
                Delivery Time:{" "}
                {moment
                  .tz(order.deliveryTime, "Africa/Lagos")
                  .format("MMM Do, YYYY [at] h:mm A")}
              </p>
            )}

            {/* Dispatcher Information */}
            {order.dispatcher && (
              <div className="dispatcher-info">
                <p>Order picked by: {order.dispatcher.name}</p>
                <p>Dispatcher Phone: {order.dispatcher.phone}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDispatchMenu;
