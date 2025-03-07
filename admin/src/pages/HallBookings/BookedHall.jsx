 import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { StoreContext } from "../../../../frontend/src/Context/StoreContext";
import moment from 'moment-timezone';
import { orderBy } from 'lodash';
import './BookedHall.css';

const formatDateTime = (dateTimeString) => {
  try {
    const date = moment.tz(dateTimeString, 'Africa/Lagos');
    if (!date.isValid()) throw new Error('Invalid date');
    return date.format("MMMM Do, YYYY [at] h:mm A");
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

const BookedHall = () => {
  const { url, token } = useContext(StoreContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEventBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/hall/list`, {
        headers: { token },
      });
      if (response.data.success) {
        const sortedEvents = orderBy(response.data.data, ['createdAt'], ['desc']);
        setEvents(sortedEvents);
      } else {
        toast.error("Error fetching events");
      }
    } catch (error) {
      toast.error("Error fetching events");
    } finally {
      setLoading(false);
    }
  };

  const updateEventStatus = async (eventId, status) => {
    try {
      const response = await axios.put(`${url}/api/hall/update-status`, {
        bookingId: eventId,
        status,
      }, {
        headers: { token },
      });
      if (response.data.success) {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === eventId ? { ...event, status } : event
          )
        );
        toast.success("Event status updated");
      } else {
        toast.error("Error updating event status");
      }
    } catch (error) {
      toast.error("Error updating event status");
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      const response = await axios.delete(`${url}/api/hall/remove`, {
        data: { id: eventId },
        headers: { token },
      });
      if (response.data.success) {
        setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
        toast.success("Event removed successfully");
      } else {
        toast.error("Error removing event");
      }
    } catch (error) {
      toast.error("Error removing event");
    }
  };

  useEffect(() => {
    fetchEventBookings();
  }, [url, token]);

  return (
    <div className="events-container">
      <h3>Booked Halls</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="events-list">
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event._id} className="event-item">
                <h3>Hall Booking</h3>
                <p>Hall ID: {event._id}</p>
                <p>Name: {event.bookedBy}</p>
                <p>Phone: {event.phoneNumber}</p>
                <p>Venue: Fidian Multi-Purpose Hall</p> {/* Set the venue as a constant */}
                <p>Type: {event.eventType}</p>
                <p>Capacity: {event.numberOfGuests} People</p>
                <p>Date of Event: {formatDateTime(event.date)}</p>
                <p>Time: {event.time}</p>
                <p>Amount: {event.amount?.toLocaleString('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                })}</p>
                {event.status !== 'Paid ✅' ? (
                  <select
                    onChange={(e) => updateEventStatus(event._id, e.target.value)}
                    value={event.status}
                    className="event-selector"
                  >
                    <option value="Pending ⌛">Pending⌛</option>
                    <option value="Paid ✅">Paid✅</option>
                  </select>
                ) : (
                  <p>Payment Confirmed ✅</p>
                )}
                <p>Booked By: {event.bookedBy}</p>
                <p>Additional Info: {event.additionalInfo}</p>
                <button
                  onClick={() => deleteEvent(event._id)}
                  className="delete-button"
                >
                  Delete Hall
                </button>
                <p>Date Booked: {formatDateTime(event.createdAt)}</p>
              </div>
            ))
          ) : (
            <p>No hall bookings found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BookedHall;
