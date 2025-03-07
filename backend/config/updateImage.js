import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";
import { connectDB } from "./config/db.js";

// Connect to the database
connectDB();

// Food schema and model
const foodSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    image: String, // Store the ImgBB URL here
    isAvailable: Boolean,
});

const Food = mongoose.model('Food', foodSchema);

// ImgBB upload function
const uploadToImgBB = async (filePath) => {
    const formData = new FormData();
    formData.append("image", fs.createReadStream(filePath));
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

// Function to update existing records
const updateExistingRecords = async () => {
    try {
        const foods = await Food.find();
        for (const food of foods) {
            const localPath = path.join(__dirname, "uploads", food.image);
            if (fs.existsSync(localPath)) {
                const imageUrl = await uploadToImgBB(localPath);
                await Food.findByIdAndUpdate(food._id, { image: imageUrl });
                console.log(`Updated image URL for food item: ${food.name}`);
            }
        }
        console.log("All records updated successfully.");
    } catch (error) {
        console.error("Error updating records:", error.message);
    } finally {
        mongoose.connection.close();
    }
};

updateExistingRecords();
