import React, { useState, useContext, useEffect } from "react";
import "./AppDownload.css";
import { assets } from "../../assets/assets";
import video from "./../../video/mama.mp4"; // Adjust the import path according to your folder structure
import { StoreContext } from "../../Context/StoreContext"; // Import the StoreContext
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AppDownload = () => {
  const [password, setPassword] = useState("");
  const [isPasswordPromptVisible, setIsPasswordPromptVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [showForm, setShowForm] = useState(false); // State to manage form visibility
  const [formData, setFormData] = useState({
    name: "",
    eventVenue: "",
    eventType: "",
    capacity: "500",
    eventDate: "2024-03-03", // Set default date to March 3, 2024
    eventTime: "12:00 PM", // Set default time to 12:00 PM
    phoneNumber: "",
    foodTypes: "",
    userId: "", // Initialize userId as an empty string
  });

  const [notification, setNotification] = useState(null);

  // Use context values (userId, token, setEventData)
  const { setEventData, url, token, userId } = useContext(StoreContext);
  const navigate = useNavigate();

  const passPhrase = "MAMAKITCHEN@1";

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (password === passPhrase) {
      setNotification("Login successful! Redirecting...");
      setTimeout(() => {
        window.location.href = "https://naijakitchenadmin.onrender.com"; // Redirect URL
      }, 2000); // Redirect after 2 seconds
    } else {
      setNotification("Incorrect passphrase. Access denied.");
    }
  };

  const handleAdminClick = () => {
    setIsPasswordPromptVisible(!isPasswordPromptVisible);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    if (!token) {
      toast.error("You are not authenticated. Please log in first.");
      return; // Exit if no token
    }

    // Include userId in the formData
    const updatedFormData = { ...formData, userId };

    try {
      const response = await axios.post(`${url}/api/events/book`, updatedFormData, {
        headers: {
          token, // Ensure the token is passed to associate the event with the user
        },
      });

      if (response.data.success) {
        setEventData(response.data.data); // Update event data in the context
        toast.success("Event booked successfully! We'll get back to you shortly.");
        setTimeout(() => {
          navigate("/myorders"); // Redirect to "myorders" page
        }, 5000);
      } else {
        toast.error("Failed to book event.");
        console.error("Server response:", response.data);
      }
    } catch (error) {
      console.error("Error booking event:", error);
      toast.error("Failed to book event.");
    }

    // Reset form data after submission
    setFormData({
      name: "",
      eventVenue: "",
      eventType: "",
      capacity: "500",
      eventDate: "2024-03-03",
      eventTime: "12:00 PM",
      phoneNumber: "",
      foodTypes: "",
      userId: "", // Reset userId after submission
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
      // Fetch necessary user data or events if required
    }
  }, [token]);

  return (
    <div
      className="app-download"
      id="app-download"
      style={{ textAlign: "center", padding: "2px" }}
    >
      <ToastContainer />
      <hr className="line" />
      <p style={{ fontSize: "17px", marginBottom: "20px" }}>
        For Better Experience <br />
        Download Our App
      </p>
      <div className="app-download-platforms" style={{ marginBottom: "20px" }}>
        <img
          src={assets.play_store}
          alt="Play Store"
          style={{ marginRight: "10px" }}
        />
        <img src={assets.app_store} alt="App Store" />
      </div>
      <div
        className="admin"
        onClick={handleAdminClick}
        style={{
          backgroundColor: "#007BFF",
          color: "white",
          padding: "10px 30px",
          borderRadius: "5px",
          cursor: "pointer",
          display: "inline-block",
        }}
      >
        Admin
      </div>

      {isPasswordPromptVisible && (
        <div
          className="password-prompt"
          style={{
            marginTop: "10px",
            backgroundColor: "green",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            width: "300px",
            margin: "10px auto",
          }}
        >
          <form
            onSubmit={handlePasswordSubmit}
            style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                style={{
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  width: "100%",
                }}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{
                  position: "absolute",
                  right: "-10px",
                  top: "40%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "green",
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
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
              Submit
            </button>
          </form>
        </div>
      )}

      <hr className="after" />

      {/* Event Booking Section */}
      <div
        className="events"
        style={{
          padding: "20px",
          marginTop: "20px",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "rgb(250, 253, 255)",
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
          Let us cook for your guests
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
          Book Event
        </button>

        {/* Event Booking Form */}
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
              maxWidth: "100%", // Increased max width for larger screens
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
                Let us cook for your guests
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

              {/* Event Venue */}
              <div className="form-group" style={{ width: "100%" }}>
                <label
                  htmlFor="eventVenue"
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                    color: "Black",
                    fontSize: "16px",
                  }}
                >
                  Event Venue
                </label>
                <input
                  type="text"
                  id="eventVenue"
                  name="eventVenue"
                  value={formData.eventVenue}
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
                <input
                  type="text"
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
                />
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

              {/* Food Types */}
              <div className="form-group" style={{ width: "100%" }}>
                <label
                  htmlFor="foodTypes"
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                    color: "Black",
                    fontSize: "16px",
                  }}
                >
                  Food Types
                </label>
                <input
                  type="text"
                  id="foodTypes"
                  name="foodTypes"
                  value={formData.foodTypes}
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

              {/* Submit Button */}
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
                Submit
              </button>
            </form>
          </div>
        )}
      </div>

      <div
        className="video-container"
        style={{
          textAlign: "center",
          width: "100%",
          maxWidth: "100%",
          margin: "20px auto",
        }}
      >
        <video
          src={video} // Use the imported video file
          autoPlay
          loop
          muted
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "100%",
            borderRadius: "20px",
          }}
        ></video>
      </div>
    </div>
  );
};

export default AppDownload;
