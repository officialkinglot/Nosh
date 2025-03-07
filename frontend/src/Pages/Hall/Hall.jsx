 import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext'; // Adjust the import path as needed

const BookHall = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    eventVenue: 'Fidian Multi-Purpose Hall', // Set the eventVenue as a constant
    eventType: '',
    capacity: '500',
    eventDate: '2024-03-03',
    eventTime: '12:00 PM',
    phoneNumber: '',
    additionalInfo: '',
    amount: '',
    email: ''
  });
  const [notification, setNotification] = useState(null);
  const [existingBookings, setExistingBookings] = useState([]);
  const [prices, setPrices] = useState({});
  const navigate = useNavigate();

  // Use context values (userId, token, url)
  const { url, token, userId } = useContext(StoreContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'eventType') {
      const price = prices[value] || 0;
      setFormData({
        ...formData,
        [name]: value,
        amount: price
      });
    }
  };

  const fetchExistingBookings = async () => {
    try {
      const response = await axios.get(`${url}/api/hall/list`, {
        headers: { token: token }, // Pass the token to authenticate the request
      });
      setExistingBookings(response.data.data);
    } catch (error) {
      console.error('Error fetching existing bookings:', error);
    }
  };

  const fetchPrices = async () => {
    try {
      const response = await axios.get(`${url}/api/hall/prices`);
      setPrices(response.data.prices);
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    if (!token) {
      toast.error("You are not authenticated. Please log in first.");
      return; // Exit if no token
    }

    // Validate form data
    if (!formData.name || !formData.eventType || !formData.capacity || !formData.eventDate || !formData.eventTime || !formData.phoneNumber || !formData.email) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Check for booking conflicts
    const isConflict = existingBookings.some(booking =>
      booking.date === formData.eventDate && booking.time === formData.eventTime
    );

    if (isConflict) {
      toast.error("The selected date and time are already booked. Please choose a different time.");
      return;
    }

    // Include userId, phoneNumber, and bookedBy in the formData
    const updatedFormData = { ...formData, userId, phoneNumber: formData.phoneNumber, bookedBy: formData.name };

    try {
      const response = await axios.post(`${url}/api/hall/book`, updatedFormData, {
        headers: {
          token, // Ensure the token is passed to associate the event with the user
        },
      });

      if (response.data.success) {
        // Redirect to Paystack payment page
        window.location.href = response.data.session_url;
      } else {
        toast.error("Failed to book hall.");
        console.error("Server response:", response.data);
      }
    } catch (error) {
      console.error("Error booking hall:", error);
      toast.error("Failed to book hall.");
    }

    // Reset form data after submission
    setFormData({
      name: '',
      eventVenue: 'Fidian Multi-Purpose Hall', // Reset eventVenue to the constant value
      eventType: '',
      capacity: '500',
      eventDate: '2024-03-03',
      eventTime: '12:00 PM',
      phoneNumber: '',
      additionalInfo: '',
      amount: '',
      email: ''
    });

    // Hide form after submission
    setShowForm(false);
  };

  // Clear notifications after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    // Check if token exists and load any necessary data if needed
    if (token) {
      fetchExistingBookings();
      fetchPrices();
    }
  }, [token]);

  const formatPrice = (value) => {
    return `₦${value.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div
      className="app-download"
      id="app-download"
      style={{ textAlign: "center", padding: "2px" }}
    >
      <ToastContainer />
      <div
        className="hall-container"
        style={{
          padding: "20px",
          marginTop: "20px",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          backgroundColor:"rgb(250, 253, 255)",
          border: '4px solid #3498db', // Add border to create the circling effect
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            marginBottom: "20px",
            fontWeight: "bolder",
            color: "gray",
          }}
        >
          Book Our Hall for Your Events
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            margin: "20px 0",
            fontSize: "16px",
          }}
        >
          Book Fidian Hall
        </button>

        {showForm && (
          <div
            className="form-container"
            style={{
              backgroundColor: "rgba(166, 161, 174, 0.792)",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.0)",
              width: "100%",
              margin: "0 auto",
              maxWidth: "100%",
            }}
          >
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "15px",
              }}
            >
              <h3
                style={{
                  color: "blue",
                  textAlign: "center",
                  width: "100%",
                  marginBottom: "15px",
                  fontSize: "20px",
                }}
              >
                Book Our Hall for Your Events
              </h3>

              {/* Name */}
              <div className="form-group" style={{ width: "100%" }}>
                <label
                  htmlFor="name"
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                    color: "Black",
                    fontSize: "16px",
                  }}
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                    fontSize: "16px",
                  }}
                />
              </div>

              {/* Type of Event */}
              <div className="form-group" style={{ width: "100%" }}>
                <label
                  htmlFor="eventType"
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                    color: "Black",
                    fontSize: "16px",
                  }}
                >
                  Type of Event
                </label>
                <select
                  id="eventType"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                    fontSize: "16px",
                  }}
                >
                  <option value="">Select Event Type</option>
                  <option value="Wedding">Wedding - {formatPrice(prices.Wedding || 500000)}</option>
                  <option value="Graduation">Graduation - {formatPrice(prices.Graduation || 300000)}</option>
                  <option value="BirthdayParty">BirthdayParty - {formatPrice(prices.BirthdayParty || 70000)}</option>
                  <option value="Conference">Conference - {formatPrice(prices.Conference || 400000)}</option>
                  <option value="Meetings">Meetings - {formatPrice(prices.Meetings || 700000)}</option>
                  <option value="Workshop">Workshop - {formatPrice(prices.Workshop || 800000)}</option>
                  <option value="Seminar">Seminar - {formatPrice(prices.Seminar || 800000)}</option>
                </select>
              </div>

              {/* Capacity */}
              <div className="form-group" style={{ width: "100%" }}>
                <label
                  htmlFor="capacity"
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                    color: "Black",
                    fontSize: "16px",
                  }}
                >
                  Capacity
                </label>
                <select
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                    fontSize: "16px",
                  }}
                >
                  <option value="50">50 People</option>
                  <option value="100">100 People</option>
                  <option value="200">200 People</option>
                  <option value="300">300 People</option>
                  <option value="400">400 People</option>
                  <option value="500">500 People</option>
                  <option value="1000">1000 People</option>
                  <option value="2000">2000 People</option>
                  <option value="4000">4000 People</option>
                </select>
              </div>

              {/* Date of Event */}
              <div className="form-group" style={{ width: "100%" }}>
                <label
                  htmlFor="eventDate"
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                    color: "Black",
                    fontSize: "16px",
                  }}
                >
                  Date of Event
                </label>
                <input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                    fontSize: "16px",
                  }}
                />
              </div>

              {/* Time of Event */}
              <div className="form-group" style={{ width: "100%" }}>
                <label
                  htmlFor="eventTime"
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                    color: "Black",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  Time of Event
                </label>
                <select
                  id="eventTime"
                  name="eventTime"
                  value={formData.eventTime}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  <option value="12:00 AM">12:00 AM</option>
                  <option value="1:00 AM">1:00 AM</option>
                  <option value="2:00 AM">2:00 AM</option>
                  <option value="3:00 AM">3:00 AM</option>
                  <option value="4:00 AM">4:00 AM</option>
                  <option value="5:00 AM">5:00 AM</option>
                  <option value="6:00 AM">6:00 AM</option>
                  <option value="7:00 AM">7:00 AM</option>
                  <option value="8:00 AM">8:00 AM</option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="1:00 PM">1:00 PM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                  <option value="5:00 PM">5:00 PM</option>
                  <option value="6:00 PM">6:00 PM</option>
                  <option value="7:00 PM">7:00 PM</option>
                  <option value="8:00 PM">8:00 PM</option>
                  <option value="9:00 PM">9:00 PM</option>
                  <option value="10:00 PM">10:00 PM</option>
                  <option value="11:00 PM">11:00 PM</option>
                </select>
              </div>

              {/* Phone Number */}
              <div className="form-group" style={{ width: "100%" }}>
                <label
                  htmlFor="phoneNumber"
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                    color: "Black",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                    fontSize: "16px",
                  }}
                />
              </div>

              {/* Additional Info */}
              <div className="form-group" style={{ width: "100%" }}>
                <label
                  htmlFor="additionalInfo"
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                    color: "Black",
                    fontSize: "16px",
                  }}
                >
                  Additional Info
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                    fontSize: "16px",
                  }}
                />
              </div>

              {/* Email */}
              <div className="form-group" style={{ width: "100%" }}>
                <label
                  htmlFor="email"
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                    color: "Black",
                    fontSize: "16px",
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                    fontSize: "16px",
                  }}
                />
              </div>

              {/* Proceed to Payment Button */}
              <button
                type="submit"
                style={{
                  padding: "10px 30px",
                  backgroundColor: "black",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  width: "100%",
                  fontSize: "18px",
                }}
              >
                Proceed to Payment
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookHall;
