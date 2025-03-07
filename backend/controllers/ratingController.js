import ratingModel from "../models/ratingModel.js";
import userModel from "../models/userModel.js"; // Import the user model

// Function to get rating for a food item
export const getRating = async (foodId, userId) => {
  try {
    const rating = await ratingModel.findOne({ foodId, userId });
    return rating ? rating.rating : null;
  } catch (error) {
    console.error('Error fetching rating:', error);
    throw new Error('Failed to fetch rating');
  }
};

// Function to save rating for a food item
export const saveRating = async (foodId, userId, rating) => {
  try {
    const existingRating = await ratingModel.findOne({ foodId, userId });
    if (existingRating) {
      throw new Error("You have already rated this item");
    }

    // Fetch user details
    const user = await userModel.findById(userId).select('-password -resetPasswordToken -resetPasswordExpires -cartData'); // Exclude sensitive fields
    if (!user) {
      throw new Error("User not found");
    }

    const newRating = new ratingModel({
      foodId,
      userId,
      rating,
      userDetails: {
        name: user.name,
        email: user.email,
        // Add other user details as needed
      },
    });

    await newRating.save();
  } catch (error) {
    console.error('Error saving rating:', error);
    throw new Error('Failed to save rating');
  }
};
