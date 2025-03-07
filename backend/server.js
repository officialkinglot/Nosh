import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js"; // Ensure the path is correct
import foodRouter from "./routes/foodRoute.js"; // Ensure the path is correct
import userRouter from "./routes/userRoute.js"; // Ensure the path is correct
import cartRouter from "./routes/cartRoute.js"; // Ensure the path is correct
import orderRouter from "./routes/orderRoute.js"; // Ensure the path is correct
import eventRouter from "./routes/eventRoute.js"; // Ensure the path is correct
import adminRouter from "./routes/adminRoute.js"; // Ensure the path is correct
import hallRoutes from "./routes/hallRoute.js"; // Ensure the path is correct
import ratingRouter from "./routes/ratingRoute.js"; // Ensure the path is correct
import promoCodeRoutes from "./routes/promoCodeRoute.js"; // Import the promo code routes
import deliveryFeeRoutes from "./routes/deliveryFeeRoute.js"; // Import the delivery fee routes
import dotenv from "dotenv/config";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Food from "./models/foodModel.js"; // Import the Food model

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App config
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());
 
// Database connection
connectDB();

// Configure Multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ImgBB upload function
const uploadToImgBB = async (buffer) => {
    const formData = new FormData();
    formData.append("image", buffer, { filename: "image.png", contentType: "image/png" });
    const apiKey = process.env.IMGBB_API_KEY;

    try {
        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData, {
            headers: formData.getHeaders(),
        });
        return response.data.data.url;
    } catch (error) {
        console.error("Error uploading to ImgBB:", error.message);
        throw error;
    }
};

// API endpoint for adding a new food item
app.post("/api/food/add", upload.single("image"), async (req, res) => {
    try {
        const { name, description, price, category, isAvailable } = req.body;
        const imageUrl = await uploadToImgBB(req.file.buffer);

        // Save the image locally
        const localPath = path.join(__dirname, "uploads", req.file.originalname);
        fs.writeFileSync(localPath, req.file.buffer);

        // Save the food item to MongoDB
        const newFood = new Food({
            name,
            description,
            price,
            image: imageUrl,
            category,
            isAvailable: isAvailable || true,
        });

        await newFood.save();

        res.json({ success: true, message: "Food item added successfully", food: newFood });
    } catch (error) {
        console.error("Error adding food item:", error);
        res.status(500).json({ success: false, message: "Failed to add food item", error: error.message });
    }
});

// User schema and model
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

// Middleware to verify token
const authMiddleware = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.json({ success: false, message: "Access denied. No token provided" });
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = token_decode.id;
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Route to fetch user profile
app.get('/api/user/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (user) {
            res.json({ userId: user._id, username: user.username, email: user.email });
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send('Internal Server Error');
    }
});

// API Endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/events", eventRouter);
app.use("/api/admin", adminRouter);
app.use("/api/hall", hallRoutes);
app.use("/api/rating", ratingRouter); // Use the rating router
app.use('/api/promo-code', promoCodeRoutes); // Use the promo code router
app.use('/api/admin', deliveryFeeRoutes); // Use the delivery fee router

app.get("/", (req, res) => {
    res.send("The API is Working");
});

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});
