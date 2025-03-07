import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  eventVenue: { type: String, required: true },
  eventType: { type: String, required: true },
  capacity: { type: String, required: true },
  eventDate: { type: String, required: true },
  eventTime: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  foodTypes: { type: String, required: true },
  status: { type: String, default: "Pending" }, // Status of the event (e.g. Pending, Confirmed, etc.)
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link event to a user
}, { timestamps: true }); // Timestamps for creation and updates

const Event = mongoose.model("Event", eventSchema);

export default Event;
