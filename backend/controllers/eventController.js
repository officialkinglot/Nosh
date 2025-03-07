import Event from "../models/eventModel.js"; // Import the Event model
import { sendAdminNotification } from "../controllers/orderController.js"; // Import the function to send admin notifications

// API endpoint to book an event 
const bookEvent = async (req, res) => {
  try {  
    const { name, eventVenue, eventType, capacity, eventDate, eventTime, phoneNumber, foodTypes } = req.body;
    const newEvent = new Event({
      name, eventVenue, eventType, capacity, eventDate, eventTime, phoneNumber, foodTypes,
      userId: req.body.userId // Assign the userId from the authenticated user
    });
    await newEvent.save();

    // Send SSE to admin
    sendAdminNotification(`New event booked: ${eventVenue} on ${eventDate} by ${name}`);

    res.status(201).json({ success: true, data: newEvent });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// API endpoint to list all events for the admin
const listEvents = async (req, res) => {
  try {
    // Fetch all events and populate the user details (assuming you have a User model)
    const events = await Event.find().populate('userId', 'name email'); // Populates user 'name' and 'email'

    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// API endpoint to list events booked by a logged-in user
const listUserEvents = async (req, res) => {
  try {
    const userId = req.body.userId; // Get userId from the request body
    const events = await Event.find({ userId });
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// API endpoint to remove an event
const removeEvent = async (req, res) => {
  try {
    const { id } = req.body;
    await Event.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Event removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// API endpoint to update event status
const updateEventStatus = async (req, res) => {
  try {
    const { eventId, status } = req.body;
    await Event.findByIdAndUpdate(eventId, { status });
    res.json({ success: true, message: "Event Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { bookEvent, listEvents, listUserEvents, removeEvent, updateEventStatus };
