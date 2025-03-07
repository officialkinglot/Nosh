import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { StoreContext } from '../../Context/StoreContext';
import moment from 'moment-timezone';
import './Myorders.css';
import { assets } from '../../assets/assets';

const formatDateTime = (dateTimeString) => {
  try {
    const date = moment.tz(dateTimeString, 'Africa/Lagos');
    if (!date.isValid()) {
      throw new Error('Invalid date');
    }
    return date.format('MMMM Do, YYYY [at] h:mm A');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

const MyOrders = () => {
  const { url, token, userId } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [events, setEvents] = useState([]);
  const [halls, setHalls] = useState([]);

  const fetchEventBookings = async () => {
    try {
      const response = await axios.get(`${url}/api/events/user-events`, {
        headers: { token: token }, // Pass the token to authenticate the request
      });
      console.log('Fetched events:', response.data.data); // Debugging line
      setEvents(response.data.data); // Set the fetched events to the state
    } catch (error) {
      console.error('Error fetching event data:', error);
    }
  };

  const fetchHallBookings = async () => {
    try {
      const response = await axios.get(`${url}/api/hall/list`, {
        headers: { token: token }, // Pass the token to authenticate the request
      });
      console.log('Fetched halls:', response.data.data); // Debugging line
      setHalls(response.data.data); // Set the fetched halls to the state
    } catch (error) {
      console.error('Error fetching hall data:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.post(`${url}/api/order/userorders`, {}, {
        headers: { token: token }, // Pass token to get user-specific orders
      });
      console.log('API Response:', response.data.data); // Log the API response
      const sortedOrders = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sortedOrders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    if (token && userId) {
      fetchOrders();
      fetchEventBookings();
      fetchHallBookings();
    }
  }, [token, userId]);

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className='my-orders-container'>
        {orders.length > 0 ? orders.map((order, index) => (
          <div key={index} className='my-orders-order'>
            <img src={assets.parcel_icon} alt='Parcel Icon' className='parcel-icon' />
            <p className='order-items'>
              {order.items?.map((item, itemIndex) => (
                <span key={itemIndex}>
                  {item.name} x {item.quantity}
                  {itemIndex === order.items.length - 1 ? '' : ', '}
                </span>
              ))}
            </p>
            <p className='my-order-price'>
              {order.amount?.toLocaleString('en-NG', {
                style: 'currency',
                currency: 'NGN',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p>Items: {order.items?.length || 0}</p>
            <div className='status'><span>&#x25cf;</span> <b>{order.status}</b></div>
            <button onClick={fetchOrders} className='track-order-btn'>Track Order</button>
            <p className='order-date'>{formatDateTime(order.createdAt)}</p>
          </div>
        )) : <p>No orders found.</p>}

        {/* Display the list of events */}
        {events.length > 0 ? events.map((event, index) => (
          <div key={index} className='my-orders-order'>
            <span>Name: {event.name}</span>
            <p className='order-items'>
              <span>Venue: {event.eventVenue} </span>
              <span>Capacity: {event.capacity} People</span>
            </p>
            <span>Type: {event.eventType}</span>
            <p className='my-order-price'>
              {event.foodTypes}
            </p>
            <p>Phone: {event.phoneNumber}</p>
            <div className='status'><span>&#x25cf;</span> <b>{event.status}</b></div>
            <p className='order-date'>Date: {formatDateTime(event.eventDate)}</p>
            <p className='order-date'>Time: {event.eventTime}</p>
          </div>
        )) : <p>No event bookings found.</p>}

        {/* Display the list of booked halls */}
        {halls.length > 0 ? halls.map((hall, index) => (
          <div key={index} className='my-orders-order'>
           
            <p className='order-items'>
       
            <span>Expected No of Guests: {hall.numberOfGuests} People</span>
            </p>
            <span>Type: {hall.eventType}</span>
            <p className='my-order-price'>
              {hall.amount?.toLocaleString('en-NG', {
                style: 'currency',
                currency: 'NGN',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p>Phone: {hall.phoneNumber}</p>
            <div className='status'><span>&#x25cf;</span> <b>{hall.status}</b></div>
            <p className='order-date'>Date: {formatDateTime(hall.date)}</p>
            <p>BookedBy: {hall.bookedBy}</p>
            <p className='order-date'>Time: {hall.time}</p>
          </div>
        )) : <p>No hall bookings found.</p>}
      </div>
      <ToastContainer />
    </div>
  );
};

export default MyOrders;
