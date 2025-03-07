import React, { useState, useEffect, useContext } from "react";
import "./DeliveredOrders.css"; // Import styles
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../../../frontend/src/Context/StoreContext";
import moment from "moment-timezone";
import { orderBy } from "lodash"; // Import Lodash orderBy function

const formatDateTime = (dateString) => {
  return moment.tz(dateString, "Africa/Lagos").format("MMM Do, YYYY [at] h:mm A");
};

const DeliveredOrders = () => {
  const { url } = useContext(StoreContext);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [totalDeliveredOrders, setTotalDeliveredOrders] = useState(0); // State to keep track of total delivered orders

  const fetchDeliveredOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        // Filter and sort orders that are "delivered"
        const filteredOrders = response.data.data.filter(
          (order) => order.status === "Delivered✅"
        );
        const sortedOrders = orderBy(filteredOrders, ["createdAt"], ["desc"]);
        setDeliveredOrders(sortedOrders);
        setTotalDeliveredOrders(sortedOrders.length); // Set total delivered orders
      } else {
        toast.error("Error fetching delivered orders");
      }
    } catch (error) {
      toast.error("Error fetching delivered orders");
    }
  };

  useEffect(() => {
    fetchDeliveredOrders();
  }, []);

  return (
    <div className="delivered-orders">
      <h3>DELIVERED ORDERS</h3>
      <div className="order-summary">
        <p className="total">Total Delivered Orders: {totalDeliveredOrders}</p>
      </div>
      <div className="order-list">
        {deliveredOrders.map((order, index) => (
          <div key={order._id} className="order-item">
            <div>
              <p className="order-item-name">
                {index + 1}# {order.address
                  ? `${order.address.firstName} ${order.address.lastName}`
                  : "Name not available"}
              </p>
              <div className="order-item-address">
                {order.address ? (
                  <>
                    <p>{order.address.street}</p>
                    <p>
                      {order.address.city}, {order.address.state}
                    </p>
                  </>
                ) : (
                  <p>Address not available</p>
                )}
              </div>
              <span className="order-item-phone">
                {order.address
                  ? `${order.address.phone}📞☎️📱`
                  : "Phone not available"}
              </span>
              <div className="order-item-food">
                <div className="order-item-food2">
                  {order.items.map((item, itemIndex) => (
                    <span key={itemIndex} className="food-item">
                      {item.name} X {item.quantity},
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <img src={assets.parcel_icon} alt="Parcel Icon" />
            <p className="item-price">
              {order.amount.toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
              })}
            </p>
            <p>Dispatcher Phone: {order.dispatcher.phone}</p>
            <p>Dispatcher: {order.dispatcher.name}</p>
            <p className="order-item-date">
              Ordered on: {formatDateTime(order.createdAt)}
            </p>
            <span className="pickup-time">
              Pickup Time: {formatDateTime(order.pickupTime)}
            </span>
            <p className="item-item">Items: {order.items.length} </p>
            <p className="order-item-status">Status: Delivered✅</p>
            {order.dispatcher && (
              <div className="dispatcher-info">
                <div className="time-info">
                  <span className="delivery-time">
                    Delivery Time: {formatDateTime(order.deliveryTime)}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        .delivered-orders {
          background: linear-gradient(135deg, #5b6e82 0%, #e0e0e0 100%);
          padding: 20px;
        }

        .order-item {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 20px;
          border: 2px solid tomato;
          padding: 20px;
          margin: 20px 0;
          font-size: 16px;
          font-weight: bold;
          border-radius: 10px;
          background-color: #fafafa;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .order-item-name {
          font-size: 18px;
          font-weight: bold;
          color: #cc0000;
        }

        .order-item-address {
          font-size: 16px;
          color: rgb(19, 129, 0);
        }

        .order-item-phone {
          font-size: 16px;
          color: blueviolet;
          font-weight: bold;
        }

        .order-item-food2 {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
        }

        .food-item {
          white-space: nowrap;
        }

        .item-price {
          font-size: 18px;
          color: blue;
        }

        .order-item-date {
          font-size: 16px;
          color: #333;
        }

        .order-item-status {
          font-size: 16px;
          color: rgb(65, 103, 3);
          font-weight: bold;
        }

        .dispatcher-info {
          margin-top: 10px;
          font-size: 16px;
          color: #333;
        }

        /* New orders and total orders styling */
        .order-summary {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          font-size: 20px;
          font-weight: bold;
        }

        .order-summary p {
          margin: 0;
          padding: 15px;
          background-color:rgb(250, 250, 250);
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
        }

        .order-summary p:first-child {
          background-color: #ffe8e4;
          color: #b848c3;

        }

        .order-summary p:last-child {
          background-color:rgb(121, 211, 18);
          color:rgb(80, 42, 150);
        
        }

        /* Responsive styles for desktop and laptop views */
        @media (max-width: 1440px) {
          .order-item {
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }

          .order-item-name {
            font-size: 16px;
          }

          .order-item-address {
            font-size: 15px;
          }

          .order-item-phone {
            font-size: 15px;
          }

          .order-item-food2 {
            gap: 8px;
          }

          .food-item {
            font-size: 14px;
          }

          .item-price {
            font-size: 16px;
          }

          .order-item-date {
            font-size: 15px;
          }

          .order-item-status {
            font-size: 15px;
          }

          .dispatcher-info {
            font-size: 15px;
          }
        }

        @media (max-width: 1024px) {
          .order-item {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .order-item-name {
            font-size: 15px;
          }

          .order-item-address {
            font-size: 14px;
          }

          .order-item-phone {
            font-size: 14px;
          }

          .order-item-food2 {
            gap: 5px;
          }

          .food-item {
            font-size: 13px;
          }

          .item-price {
            font-size: 15px;
          }

          .order-item-date {
            font-size: 14px;
          }

          .order-item-status {
            font-size: 14px;
          }

          .dispatcher-info {
            font-size: 14px;
          }
        }

        @media (max-width: 768px) {
          .order-summary p {
            font-size: 16px;
            padding: 8px;
          }

          .order-item {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .order-item-name {
            font-size: 14px;
          }

          .order-item-address {
            font-size: 13px;
          }

          .order-item-phone {
            font-size: 13px;
          }

          .order-item-food2 {
            gap: 3px;
          }

          .food-item {
            font-size: 12px;
          }

          .item-price {
            font-size: 14px;
          }

          .order-item-date {
            font-size: 13px;
          }

          .order-item-status {
            font-size: 13px;
          }

          .dispatcher-info {
            font-size: 13px;
          }
        }

        @media (max-width: 480px) {
          .order-summary p {
            font-size: 14px;
            padding: 6px;
          }

          .order-item {
            padding: 10px;
          }

          .order-item-name {
            font-size: 13px;
          }

          .order-item-address {
            font-size: 12px;
          }

          .order-item-phone {
            font-size: 12px;
          }

          .order-item-food2 {
            gap: 2px;
          }

          .food-item {
            font-size: 11px;
          }

          .item-price {
            font-size: 13px;
          }

          .order-item-date {
            font-size: 12px;
          }

          .order-item-status {
            font-size: 12px;
          }

          .dispatcher-info {
            font-size: 12px;
          }
        }

        @media (max-width: 320px) {
          .order-summary p {
            font-size: 12px;
            padding: 4px;
          }

          .order-item {
            padding: 8px;
          }

          .order-item-name {
            font-size: 12px;
          }

          .order-item-address {
            font-size: 11px;
          }

          .order-item-phone {
            font-size: 11px;
          }

          .order-item-food2 {
            gap: 1px;
          }

          .food-item {
            font-size: 10px;
          }

          .item-price {
            font-size: 12px;
          }

          .order-item-date {
            font-size: 11px;
          }

          .order-item-status {
            font-size: 11px;
          }

          .dispatcher-info {
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
};

export default DeliveredOrders;
