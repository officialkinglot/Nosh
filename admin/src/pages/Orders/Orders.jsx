import React, { useState, useEffect, useContext } from "react";
import "./Orders.css";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../../../frontend/src/Context/StoreContext";
import moment from 'moment-timezone';
import { orderBy } from 'lodash'; // Import Lodash orderBy function

const formatDate = (dateString) => {
  return moment.tz(dateString, 'Africa/Lagos').format("MMM Do, YYYY");
};

const formatDateTime = (dateString) => {
  return moment.tz(dateString, 'Africa/Lagos').format("MMM Do, YYYY [at] h:mm A");
};

const Orders = () => {
  const { url } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [events, setEvents] = useState([]); // State to store the list of events
  const [admin, setAdmin] = useState({ name: '', phone: '' }); // State to store admin details
  const [newOrderCount, setNewOrderCount] = useState(0); // State to keep track of new order count
  const [totalOrders, setTotalOrders] = useState(0); // State to keep track of total orders
  const [totalOrdersToday, setTotalOrdersToday] = useState(0); // State to keep track of total orders for today

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        // Sort orders in descending order based on creation date using Lodash
        const sortedOrders = orderBy(response.data.data, ['createdAt'], ['desc']);
        console.log("Fetched orders:", sortedOrders); // Debugging line
        setOrders(sortedOrders);
        // Count the number of new orders
        const newOrders = sortedOrders.filter(order => order.status === "Food Order Processing");
        setNewOrderCount(newOrders.length);
        // Set total orders
        setTotalOrders(sortedOrders.length);
        // Calculate total orders for today
        const today = moment().tz('Africa/Lagos').startOf('day');
        const ordersToday = sortedOrders.filter(order => moment(order.createdAt).isSameOrAfter(today));
        setTotalOrdersToday(ordersToday.length);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      toast.error("Error fetching orders");
    }
  };

  const fetchEventBookings = async () => {
    try {
      const response = await axios.get(`${url}/api/events/list`);
      if (response.data.success) {
        // Sort events in descending order based on creation date using Lodash
        const sortedEvents = orderBy(response.data.data, ['createdAt'], ['desc']);
        console.log("Fetched events:", sortedEvents); // Debugging line
        setEvents(sortedEvents);
      } else {
        toast.error("Error fetching events");
      }
    } catch (error) {
      toast.error("Error fetching events");
    }
  };

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;

    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: newStatus,
        dispatcher: newStatus === "Out For Delivery🚚" ? {
          name: admin.name,
          phone: admin.phone
        } : null,
        pickedByAdmin: newStatus === "Out For Delivery🚚" ? {
          name: admin.name,
          phone: admin.phone
        } : null,
        pickedAt: newStatus === "Out For Delivery🚚" ? new Date().toISOString() : null
      });
      if (response.data.success) {
        await fetchAllOrders(); // Refresh orders
        toast.success("Order status updated");
      } else {
        toast.error("Error updating order status");
      }
    } catch (error) {
      toast.error("Error updating order status");
    }
  };

  const eventStatusHandler = async (event, eventId) => {
    try {
      const response = await axios.post(`${url}/api/events/updateStatus`, {
        eventId,
        status: event.target.value,
      });
      if (response.data.success) {
        await fetchEventBookings();
        toast.success("Event status updated");
      } else {
        toast.error("Error updating event status");
      }
    } catch (error) {
      toast.error("Error updating event status");
    }
  };

  const removeOrder = async (orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/remove`, {
        id: orderId,
      });
      await fetchAllOrders();
      if (response.data.success) {
        toast.success("Order removed successfully");
      } else {
        toast.error("Error removing order");
      }
    } catch (error) {
      toast.error("Error removing order");
    }
  };

  const removeEvent = async (eventId) => {
    try {
      const response = await axios.post(`${url}/api/events/remove`, {
        id: eventId,
      });
      await fetchEventBookings();
      if (response.data.success) {
        toast.success("Event removed successfully");
      } else {
        toast.error("Error removing event");
      }
    } catch (error) {
      toast.error("Error removing event");
    }
  };

  useEffect(() => {
    fetchAllOrders();
    fetchEventBookings();
    // Fetch admin details from session storage
    const adminName = sessionStorage.getItem("adminName");
    const adminPhone = sessionStorage.getItem("adminPhone");
    setAdmin({ name: adminName, phone: adminPhone });
  }, []);

  return (
    <div className="order-add">
      <h3>ORDER PAGE</h3>
      <div className="order-summary">
        <p>Total Orders: {totalOrders}</p>
        <p>Total Orders Today: {totalOrdersToday}</p>
      </div>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={order._id} className="order-item">
            <div>
              <p className="order-item-name">
                {order.address ? `${order.address.firstName} ${order.address.lastName}` : 'Address not available'}
              </p>
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
              <span className="order-item-phone">
                {order.address ? `${order.address.phone}📞☎️📱` : 'Phone not available'}
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
            <p className="item-item">Items: {order.items.length} </p>
            <p className="item-price">
              {order.amount.toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
              })}
            </p>
            <p className="order-item-date">
              Ordered on: {formatDateTime(order.createdAt)}
            </p>
            <p className="order-number">Order Number: {index + 1}</p> {/* Added numbering */}
            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
              className="selector"
              disabled={order.status === "Out For Delivery🚚" || order.status === "Delivered✅"}
            >
              <option value="Food Order Processing">
                Food Order Processing⌛
              </option>
              <option value="Out For Delivery🚚">Out For Delivery🚚</option>
              <option value="Delivered✅">Delivered✅</option>
            </select>
            <button
              onClick={() => removeOrder(order._id)}
              className="delete-button"
            >
              Delete Order
            </button>
            {order.status === "Out For Delivery🚚" && (
              <div className="dispatcher-info">
                {order.pickedByAdmin ? (
                  <>
                    <p className="picked-by-admin">Order picked by Admin: {order.pickedByAdmin.name}</p>
                    <p className="picked-by-admin">Admin Phone: {order.pickedByAdmin.phone}</p>
                  </>
                ) : order.dispatcher ? (
                  <>
                    
            {/* Dispatcher Information */}
            {order.dispatcher && (
              <div className="dispatcher-info">
                <p>Order picked by: {order.dispatcher.name}</p>
                <p>Dispatcher Phone: {order.dispatcher.phone}</p>
              </div>
            )}
                  </>
                ) : (
                  <p>Picked by information not available</p>
                )}
                 {/* Pickup Time */}
                           {order.pickupTime && (
                             <p className="order-item-date">
                               Pickup Time: {moment.tz(order.pickupTime, 'Africa/Lagos').format("MMM Do, YYYY [at] h\:mm A")}
                             </p>
                           )}
              </div>
            )}
            {order.status === "Delivered✅" && (
              <div className="dispatcher-info">
                {/* Display delivery time if available */}
                {order.deliveryTime && (
                  <p>Delivered at: {formatDateTime(order.deliveryTime)}</p>
                )}
              </div>
            )}
            {order.status === "Food Order Processing" && (
              <div className="new-order-indicator">
                <p>New Order</p>
                <p>Order Number: {newOrderCount - index}</p>
              </div>
            )}
          </div>
        ))}

        {/* Display the list of events */}
        {events.map((event) => (
          <div key={event._id} className="event-item">
            <h3>Event Booking</h3>
            <p className="yourname">Name: {event.name}</p>
            <p>Venue: {event.eventVenue}</p>
            <p>Type: {event.eventType}</p>
            <p>Capacity: {event.capacity} People</p>
            <p className="date">Date of Event: {formatDate(event.eventDate)}</p>
            <p>Time: {event.eventTime}</p>
            <select
              onChange={(e) => eventStatusHandler(e, event._id)}
              value={event.status}
              className="eventselector"
            >
              <option value="Pending ⌛">Pending⌛</option>
              <option value="Paid ✅">Paid✅</option>
            </select>
            <p>Phone: {event.phoneNumber}</p>
            <p className="food">Food:{event.foodTypes} </p>
            <button
              onClick={() => removeEvent(event._id)}
              className="delete-button"
            >
              Delete Event
            </button>
          </div>
        ))}
      </div>

      <style>{`
        /* Wrapper class for Dispatch Menu to scope styles */
        .order-add {
          background: linear-gradient(135deg, #5b6e82 0%, #e0e0e0 100%);
          padding: 20px;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 1s ease-in-out forwards;
        }

        .order-summary {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          font-size: 18px;
          font-weight: bold;
        }

        .item-item,
        .item-price {
          font-size: 16px;
          color: blue;
        }

        .order-item, .event-item {
          display: grid;
          grid-template-columns: 0.5fr 2fr 1fr 1fr 1fr;
          align-items: start;
          gap: 20px;
          border: 2px solid tomato;
          padding: 15px;
          margin: 20px 0;
          font-size: 14px;
          font-weight: bold;
          border-radius: 10px;
          color: black;
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

        .order-item-name, .yourname {
          font-size: 18px;
          display: flex;
          font-weight: bold;
          color: #cc0000;
        }

        .order-item-address, .event-item p {
          font-size: 14px;
          color: rgb(19, 129, 0);
        }

        .order-item-phone, .event-item-phone {
          font-size: 14px;
          color: blueviolet;
          font-weight: bold;
        }

        .order-item-food span, .event-item p {
          font-family: Verdana, sans-serif;
          font-size: 14px;
          color: rgba(3, 3, 3, 0.757);
        }

        .order-item select, .eventselector {
          background-color: #ffe8e4;
          border: 2px solid #b848c3;
          padding: 8px;
          font-size: 14px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .order-item select:hover, .eventselector:hover {
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

        .event-item .yourname {
          color: #b848c3;
        }

        .event-item .food {
          color: #300230;
        }

        .event-item .date {
          color: #15023b;
        }

        .delete-button {
          background-color: #ff4d4d;
          color: rgb(255, 255, 255);
          border: none;
          border-radius: 5px;
          padding: 8px 12px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s ease;
          margin-left: auto; /* Move the button to the right */
        }

        .delete-button:hover {
          background-color: #ff1a1a;
        }

        /* Event dropdown status styles */
        .eventselector {
          width: max(8vw, 110px);
          outline: none;
          height: fit-content;
          font-weight: 700;
        }

        .eventselector:focus {
          border-color: #300230;
          box-shadow: 0 0 5px rgba(19, 129, 0, 0.5);
        }

        /* Media queries for responsiveness */

        /* For large tablets and small desktops (max-width: 1024px) */
        @media (max-width: 1024px) {
          .order-item, .event-item {
            grid-template-columns: 1fr 1fr 1fr 1fr;
            font-size: 13px;
            padding: 12px;
          }

          .order-item select, .eventselector {
            font-size: 13px;
            padding: 7px;
          }
        }

        /* For tablets and smaller screens (max-width: 768px) */
        @media (max-width: 768px) {
          .eventselector {
            width: 100%;
            padding: 8px;
            font-size: 12px;
          }

          .order-item, .event-item {
            grid-template-columns: 1fr;
            font-size: 12px;
            padding: 10px;
          }

          .order-item select, .eventselector {
            width: 100%;
            font-size: 12px;
            padding: 6px;
          }

          .order-item img {
            width: 30px;
          }

          .order-item-food2 {
            grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
          }

          .order-add {
            margin-left: 20px;
          }
        }

        /* For mobile devices (max-width: 480px) */
        @media (max-width: 480px) {
          .eventselector {
            width: 100%;
            padding: 6px;
            font-size: 10px;
          }

          .order-item, .event-item {
            display: flex;
            flex-direction: column;
            font-size: 10px;
            padding: 8px;
          }

          .order-item select, .eventselector {
            font-size: 10px;
            padding: 5px;
          }

          .order-item img {
            width: 25px;
            margin-bottom: 8px;
          }

          .order-item-food2 {
            grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
            gap: 5px;
          }

          .order-add {
            margin-left: 10px;
          }
        }

        /* For very small mobile devices (max-width: 320px) */
        @media (max-width: 320px) {
          .eventselector {
            width: 100%;
            padding: 4px;
            font-size: 8px;
          }

          .order-item, .event-item {
            display: flex;
            flex-direction: column;
            font-size: 8px;
            padding: 6px;
          }

          .order-item select, .eventselector {
            font-size: 8px;
            padding: 4px;
          }

          .order-item img {
            width: 20px;
            margin-bottom: 6px;
          }

          .order-item-food2 {
            grid-template-columns: repeat(auto-fill, minmax(30px, 1fr));
            gap: 3px;
          }

          .order-add {
            margin-left: 5px;
          }
        }

        /* General container styling */
        .order-list {
          display: grid;
          gap: 20px;
        }

        /* Keyframes for animations */
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
          background-color:rgb(105, 255, 59);
          color: #333;
          padding: 3px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: bold;
          text-align: center;
          width: 100%;
          margin-left: 0; /* Move to the left */
        }

        .picked-by-admin {
          font-size: 16px; /* Increased font size */
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default Orders;
