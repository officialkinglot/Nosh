import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    userDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      // Add other user details as needed
    },
  },
  { timestamps: true }
);

export default mongoose.model("Rating", ratingSchema);
