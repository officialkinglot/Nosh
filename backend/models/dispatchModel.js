import mongoose from "mongoose";

const dispatchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  position: { type: String, required: true },
});

const dispatchModel = mongoose.model("Dispatch", dispatchSchema);

export default dispatchModel;
