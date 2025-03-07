import React, { useState, useEffect, useContext } from "react";
import "../DispatchMenu/DispatchMenu.css";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import axios from "axios";
import { StoreContext } from "../../../../frontend/src/Context/StoreContext";
import moment from "moment-timezone";

const DispatchMenu = () => {
  const { url } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [newOrderCount, setNewOrderCount] = useState(0);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        const sortedOrders = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
        const newOrders = sortedOrders.filter(
          (order) => order.status === "Food Order Processing"
        );
        setNewOrderCount(newOrders.length);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      toast.error("Error fetching orders");
    }
  };

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: newStatus,
        dispatcher: {
          name: name,
          phone: phone,
        },
        pickupTime: newStatus === "Out For Delivery🚚" ? new Date() : null,
        deliveryTime: newStatus === "Delivered✅" ? new Date() : null,
      });
      if (response.data.success) {
        await fetchAllOrders();
        toast.success("Order status updated");
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      toast.error("Error updating order status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
    const dispatchName = sessionStorage.getItem("dispatchName");
    const dispatchPhone = sessionStorage.getItem("dispatchPhone");
    if (dispatchName && dispatchPhone) {
      setName(dispatchName);
      setPhone(dispatchPhone);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("dispatchName", name);
    sessionStorage.setItem("dispatchPhone", phone);
  }, [name, phone]);

  return (
    <div className="dispatch-menu">
      <h3>
        DISPATCHER: <span className="dispatch-name">{name} </span>{" "}
        <span className="dispatch-phone">{phone} </span>
      </h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
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

            <div className="order-item-food">
              <img
                src={assets.parcel_icon}
                alt="Parcel"
                className="food-item-image"
              />
              <div>
                {order.items.map((item, itemIndex) => (
                  <span key={itemIndex} className="food-item">
                    {item.name} x{item.quantity},
                  </span>
                ))}
              </div>
            </div>
            <div className="order-total">
              <p>Total Price: ₦{order.amount.toLocaleString("en-NG")}</p>
            </div>

            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
              className="selector"
              disabled={
                order.status === "Delivered✅" ||
                (order.status === "Out For Delivery🚚" &&
                  order.dispatcher &&
                  order.dispatcher.name !== name) ||
                (order.status === "Food Order Processing" &&
                  order.dispatcher &&
                  order.dispatcher.name !== name)
              }
            >
              <option value="Food Order Processing">
                Food Order Processing ⌛
              </option>
              <option value="Out For Delivery🚚">Out For Delivery 🚚</option>
              <option value="Delivered✅">Delivered ✅</option>
            </select>

            <p className="order-item-date">
              Ordered on:{" "}
              {moment
                .tz(order.createdAt, "Africa/Lagos")
                .format("MMM Do, YYYY [at] h:mm A")}
            </p>

            {order.pickupTime && (
              <p className="order-item-date">
                Pickup Time:{" "}
                {moment
                  .tz(order.pickupTime, "Africa/Lagos")
                  .format("MMM Do, YYYY [at] h:mm A")}
              </p>
            )}

            {order.deliveryTime && (
              <p className="order-item-date">
                Delivery Time:{" "}
                {moment
                  .tz(order.deliveryTime, "Africa/Lagos")
                  .format("MMM Do, YYYY [at] h:mm A")}
              </p>
            )}

            {order.dispatcher && (
              <div className="dispatcher-info">
                <p>Order picked by: {order.dispatcher.name}</p>
                <p>Dispatcher Phone: {order.dispatcher.phone}</p>
              </div>
            )}

            {order.status === "Food Order Processing" && (
              <div className="new-order-indicator">
                <p>New Order</p>
                <p>Order Number:{newOrderCount - index}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        .dispatch-menu {
          background: linear-gradient(135deg, #010101 0%, #000000 100%);
          padding: 20px;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 1s ease-in-out forwards;
        }

        .dispatch-menu h3{
          color: #00c8e2;
        }

        .dispatch-name {
          color: #073ded;
          font-weight: bold;
        }

        .dispatch-phone{
          color: #fbfbfb;
          font-weight: bold;
        }

        .item-item,
        .item-price {
          font-size: 16px;
        }

        .order-item {
          display: grid;
          grid-template-columns: 0.5fr 2fr  1fr 1fr;
          align-items: start;
          gap: 20px;
          border: 2px solid tomato;
          padding: 15px;
          margin: 20px 0;
          font-size: 16px;
          font-weight: bold;
          border-radius: 10px;
          color: rgb(0, 0, 180);
          background-color: #fafafa;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          opacity: 0;
          transform: translateX(-50px);
          animation: slideIn 1s ease-in-out forwards;
        }

        .order-item-food,
        .order-item-name {
          font-weight: 700;
          margin: 1px 1px;
        }

        .order-item-name {
          font-size: 18px;
          display: flex;
          font-weight: bold;
          color: #060606;
        }

        .order-item-address p {
          font-size: 14px;
          color: rgb(18, 102, 3);
        }

        .order-item-phone {
          font-size: 14px;
          color: blueviolet;
          font-weight: bold;
        }

        .order-item-date {
          color: rgb(248, 0, 66);
          font-weight: bold;
        }

        .order-item-food span {
          font-family: Verdana, sans-serif;
          font-size: 14px;
          color: rgba(3, 3, 3, 0.757);
        }

        .order-item select {
          background-color: #ffe8e4;
          border: 2px solid #b848c3;
          padding: 8px;
          font-size: 14px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .order-item select:hover {
          color: rgb(16, 2, 97);
          background-color: #ffd6d6;
        }

        .order-item-food2 {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(70px, 1fr 1fr));
          gap: 1px;
          align-items: center;
        }

        .food-item {
          white-space: nowrap;
        }

        .delete-button {
          background-color: #ff4d4d;
          color: white;
          border: none;
          border-radius: 5px;
          padding: 8px 12px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s ease;
        }

        .delete-button:hover {
          background-color: #ff1a1a;
        }

        @media (max-width: 1024px) {
          .order-item {
            grid-template-columns: 1fr 1fr 1fr 1fr;
            font-size: 13px;
            padding: 12px;
          }

          .order-item select {
            font-size: 13px;
            padding: 7px;
          }

          .new-order-indicator {
            font-size: 12px;
            padding: 3px;
            width: 50%;
          }
        }

        @media (max-width: 768px) {
          .order-item {
            grid-template-columns: 1fr;
            font-size: 12px;
            padding: 10px;
          }

          .order-item select {
            width: 100%;
            font-size: 12px;
            padding: 6px;
          }

          .order-item-food2 {
            grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
          }

          .dispatch-menu {
            margin-left: 20px;
          }

          .new-order-indicator {
            font-size: 11px;
            padding: 2px;
            width: 60%;
          }
        }

        @media (max-width: 480px) {
          .order-item {
            display: flex;
            flex-direction: column;
            font-size: 10px;
            padding: 8px;
          }

          .order-item select {
            font-size: 10px;
            padding: 5px;
          }

          .order-item-food2 {
            grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
            gap: 5px;
          }

          .dispatch-menu {
            margin-left: 10px;
          }

          .new-order-indicator {
            font-size: 9px;
            padding: 1px;
            width: 70%;
          }
        }

        @media (max-width: 320px) {
          .order-item {
            display: flex;
            flex-direction: column;
            font-size: 8px;
            padding: 6px;
          }

          .order-item select {
            font-size: 8px;
            padding: 4px;
          }

          .order-item-food2 {
            grid-template-columns: repeat(auto-fill, minmax(30px, 1fr));
            gap: 3px;
          }

          .dispatch-menu {
            margin-left: 5px;
          }

          .new-order-indicator {
            font-size: 7px;
            padding: 1px;
            width: 80%;
          }
        }

        .order-list {
          display: grid;
          gap: 20px;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .new-order-indicator {
          background-color:rgb(222, 201, 6);
          color: #333;
          padding: 1px;
          border-radius: 50px;
          font-size: 10px;
          font-weight: bold;
          text-align: center;
          width: 40%;
        }
      `}</style>
    </div>
  );
};

export default DispatchMenu;
