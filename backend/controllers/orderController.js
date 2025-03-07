import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// API for placing a new order and initializing payment
const placeOrder = async (req, res) => {
    const frontend_url = "https://naijakitchenfront.onrender.com"; // Ensure this is correct

    try {
        // Create a new order but don't clear the cart yet
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });
        await newOrder.save();

        const line_items = req.body.items.map(item => ({
            name: item.name,
            price: item.price * 100,  // Convert to kobo (currency in the smallest unit)
            quantity: item.quantity
        }));

        const data = {
            email: req.body.email,
            amount: req.body.amount * 100, // Convert to kobo
            metadata: {
                cart_items: line_items,
                order_id: newOrder._id,
                user_id: req.body.userId
            },
            callback_url: `${frontend_url}/verify?orderId=${newOrder._id}&success=true`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        };

        const response = await axios.post('https://api.paystack.co/transaction/initialize', data, {
            headers: {
                Authorization:`Bearer ${PAYSTACK_SECRET_KEY}`
            }
        });

        // Respond with the session URL for the frontend to redirect to Paystack
        res.json({ success: true, session_url: response.data.data.authorization_url });
    } catch (error) {
        console.log({ success: false, message: "Server Error", error: error.message });
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// API for verifying the payment
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === 'true') {
            // Update the order to mark it as paid
            await orderModel.findByIdAndUpdate(orderId, { payment: true });

            // Clear the user's cart now that payment is successful
            const order = await orderModel.findById(orderId);
            await userModel.findOneAndUpdate({ _id: order.userId }, { cartData: {} });

            res.json({ success: true, message: "Paid Successfully" });
        } else {
            // Delete the order if payment failed
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Payment failed or canceled" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error verifying payment" });
    }
};

// User orders for frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error retrieving orders" });
    }
};

// Listing Orders for admin panel/customer's orders
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ createdAt: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error listing orders" });
    }
};

// API for updating order status
const updateStatus = async (req, res) => {
    const { orderId, status, dispatcher } = req.body;

    try {
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Save the current status and time if it's being updated
        if (status === 'Out For Delivery🚚' && !order.pickupTime) {
            order.pickupTime = new Date();
        }
        if (status === 'Delivered✅' && !order.deliveryTime) {
            order.deliveryTime = new Date();
        }

        order.status = status;
        if (status === 'Out For Delivery🚚') {
            order.dispatcher = dispatcher;
        }

        await order.save();
        res.json({ success: true, message: 'Order status updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating order status" });
    }
};

// API for removing an order
const removeOrder = async (req, res) => {
    try {
        const { id } = req.body;
        await orderModel.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Order removed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, removeOrder };
