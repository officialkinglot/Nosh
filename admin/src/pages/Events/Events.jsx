import React, { useState, useEffect, useContext } from "react";
import "./Events.css";
import { toast } from "react-toastify";
import axios from "axios";
import { StoreContext } from "../../../../frontend/src/Context/StoreContext";
import moment from 'moment-timezone';
import { orderBy } from 'lodash'; // Import Lodash orderBy function

const formatDate = (dateString) => {
  return moment.tz(dateString, 'Africa/Lagos').format("MMM Do, YYYY");
};

const Events = () => {
  const { url } = useContext(StoreContext);
  const [events, setEvents] = useState([]);

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
    fetchEventBookings();
  }, []);

  return (
    <div className="events-container">
      <h3>EVENTS PAGE</h3>
      <div className="events-list">
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
    </div>
  );
};

export default Events;
