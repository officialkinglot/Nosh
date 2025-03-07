import userModel from "../models/userModel.js";

// Add Items to User Cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        const cartData = userData.cartData || {};

        if (!cartData[itemId]) {
            cartData[itemId] = 1;
        } else {
            cartData[itemId] += 1;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Added to Cart" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error" });
    }
};

// Remove Items from User Cart
const removeFromCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        const cartData = userData.cartData || {};

        if (cartData[itemId] > 0) {
            cartData[itemId] -= 1;
            if (cartData[itemId] === 0) {
                delete cartData[itemId];
            }
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Removed from Cart" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error" });
    }
};

// Fetch User Cart Data
const getCart = async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        const cartData = userData.cartData || {};
        res.json({ success: true, cartData });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error" });
    }
};

export { addToCart, removeFromCart, getCart };
