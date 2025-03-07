import Food from "../models/foodModel.js";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import path from "path";
import { fileURLToPath } from "url";

 // Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


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

// Add food item
const addFood = async (req, res) => {
    try {
        const { name, description, price, category, isAvailable } = req.body;

        if (!name || !description || !price || !category || !req.file) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const imageUrl = await uploadToImgBB(req.file.buffer);

        // Save the image locally
        const localPath = path.join(__dirname, "..", "uploads", req.file.filename);
        fs.writeFileSync(localPath, req.file.buffer);

        const food = new Food({
            name,
            description,
            price,
            category,
            image: imageUrl, // Save the ImgBB URL
            isAvailable: isAvailable === "true" // Convert string to boolean
        });

        await food.save();
        res.json({ success: true, message: "Food Item Added" });
    } catch (error) {
        console.error("Error adding food item:", error);
        res.status(500).json({ success: false, message: "Failed to add food item", error: error.message });
    }
};

// All food lists
const listFood = async (req, res) => {
    try {
        const food = await Food.find({});
        res.json({ success: true, data: food });
    } catch (error) {
        console.error("Error listing food items:", error);
        res.status(500).json({ success: false, message: "Failed to list food items", error: error.message });
    }
};

 
// Remove food items
const removeFood = async (req, res) => {
    try {
        const food = await Food.findById(req.body.id);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }

        // Remove from MongoDB
        await Food.findByIdAndDelete(req.body.id);

        // Remove from local storage
        const localFilename = food.image.split('/').pop(); // Extract the filename from the URL
        const localPath = path.join(__dirname, "..", "uploads", localFilename);
        fs.unlink(localPath, (err) => {
            if (err) {
                console.error("Error deleting local file:", err);
            }
        });

        // Remove from ImgBB
        const imgBBUrl = food.image;
        if (imgBBUrl.startsWith("https://i.ibb.co/")) {
            const imgBBKey = imgBBUrl.split("/")[4];
            const apiKey = process.env.IMGBB_API_KEY;
            try {
                await axios.post(`https://api.imgbb.com/1/delete?key=${apiKey}&image=${imgBBKey}`, null, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            } catch (error) {
                console.error("Error deleting image from ImgBB:", error);
            }
        }

        res.json({ success: true, message: "Food Item Removed" });
    } catch (error) {
        console.error("Error removing food item:", error);
        res.status(500).json({ success: false, message: "Failed to remove food item", error: error.message });
    }
};

// Update food item availability
const updateAvailability = async (req, res) => {
    try {
        const food = await Food.findByIdAndUpdate(req.body.id, {
            isAvailable: req.body.isAvailable
        }, { new: true });

        res.json({ success: true, message: "Food Item Availability Updated", data: food });
    } catch (error) {
        console.error("Error updating food item availability:", error);
        res.status(500).json({ success: false, message: "Failed to update food item availability", error: error.message });
    }
};

export { addFood, listFood, removeFood, updateAvailability };
 