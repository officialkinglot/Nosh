import express from "express";
import { getRating, saveRating } from "../controllers/ratingController.js";
import jwt from "jsonwebtoken";

const ratingRouter = express.Router();

// Middleware to authenticate user
const authenticateUser = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Failed to authenticate token" });
    }
    req.userId = decoded.id;
    next();
  });
};

// Route to get rating for a food item
ratingRouter.get("/getRating", async (req, res) => {
  const { foodId, userId } = req.query;
  try {
    const rating = await getRating(foodId, userId);
    res.json({ rating });
  } catch (error) {
    console.error('Error getting rating:', error);
    res.status(500).json({ message: error.message });
  }
});

// Route to save rating for a food item
ratingRouter.post("/saveRating", authenticateUser, async (req, res) => {
  const { foodId, rating } = req.body;
  try {
    await saveRating(foodId, req.userId, rating);
    res.json({ message: "Rating saved successfully" });
  } catch (error) {
    console.error('Error saving rating:', error);
    res.status(500).json({ message: error.message });
  }
});

export default ratingRouter;
