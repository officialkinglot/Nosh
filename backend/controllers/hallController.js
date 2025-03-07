import hallModel from "../models/hallModel.js";
import userModel from "../models/userModel.js";
import Price from "../models/pricesModel.js"; // Import the Price model
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// API for booking a hall and initializing payment
const bookHall = async (req, res) => {
    const frontend_url = "http://localhost:5173"; // Ensure this is correct

    try {
        // Check for booking conflicts
        const existingBooking = await hallModel.findOne({
            date: req.body.eventDate,
            time: req.body.eventTime
        });

        if (existingBooking) {
            return res.status(400).json({ success: false, message: "The selected date and time are already booked. Please choose a different time." });
        }

        // Create a new hall booking but don't mark it as paid yet
        const newBooking = new hallModel({
            userId: req.body.userId,
            eventType: req.body.eventType,
            date: req.body.eventDate,
            time: req.body.eventTime,
            numberOfGuests: req.body.capacity,
            additionalInfo: req.body.additionalInfo,
            amount: req.body.amount,
            phoneNumber: req.body.phoneNumber, // Added phone number field
            bookedBy: req.body.name, // Added booked by field
        });
        await newBooking.save();

        const data = {
            email: req.body.email,
            phone: req.body.phoneNumber, // Use phoneNumber field
            amount: req.body.amount * 100, // Convert to kobo
            metadata: {
                eventType: req.body.eventType,
                booking_id: newBooking._id,
                user_id: req.body.userId
            },
            callback_url: `${frontend_url}/verify-hall?bookingId=${newBooking._id}&success=true`,
            cancel_url: `${frontend_url}/verify-hall?success=false&bookingId=${newBooking._id}`,
        };

        const response = await axios.post('https://api.paystack.co/transaction/initialize', data, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
            }
        });

        // Respond with the session URL for the frontend to redirect to Paystack
        res.json({ success: true, session_url: response.data.data.authorization_url });
    } catch (error) {
        console.error({ success: false, message: "Server Error", error: error.message });
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// API for verifying the hall booking payment
const verifyHallBooking = async (req, res) => {
    const { bookingId, success } = req.query;
    try {
        if (success === 'true') {
            // Update the booking to mark it as paid
            await hallModel.findByIdAndUpdate(bookingId, { payment: true });

            // Clear the user's cart now that payment is successful
            const booking = await hallModel.findById(bookingId);
            await userModel.findOneAndUpdate({ _id: booking.userId }, { cartData: {} });

            res.json({ success: true, message: "Paid Successfully" });
        } else {
            // Delete the booking if payment failed
            await hallModel.findByIdAndDelete(bookingId);
            res.json({ success: false, message: "Payment failed or canceled" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error verifying payment" });
    }
};

// Listing Bookings for admin panel/customer's bookings
const listBookings = async (req, res) => {
    try {
        const bookings = await hallModel.find({}).populate('userId', 'name phone').sort({ createdAt: -1 });
        res.json({ success: true, data: bookings });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error listing bookings" });
    }
};

// API for updating booking status
const updateBookingStatus = async (req, res) => {
    const { bookingId, status } = req.body;

    try {
        const booking = await hallModel.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        booking.status = status;
        await booking.save();
        res.json({ success: true, message: 'Booking status updated' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error updating booking status" });
    }
};

// API for removing a booking
const removeBooking = async (req, res) => {
    try {
        const { id } = req.body;
        await hallModel.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Booking removed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// API for updating prices
const updatePrices = async (req, res) => {
    const { eventType, newPrice } = req.body;

    try {
        // Update the price in the Price model
        const price = await Price.findOneAndUpdate({ eventType }, { price: newPrice }, { new: true, upsert: true });

        // Update the price in existing bookings
        const bookings = await hallModel.find({ eventType });
        bookings.forEach(async (booking) => {
            booking.amount = newPrice;
            await booking.save();
        });

        res.json({ success: true, message: 'Prices updated successfully', price });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error updating prices" });
    }
};
// API for getting prices
const getPrices = async (req, res) => {
    try {
        const prices = await Price.find();
        const priceMap = prices.reduce((acc, price) => {
            acc[price.eventType] = price.price;
            return acc;
        }, {});
        res.json({ success: true, prices: priceMap });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error fetching prices" });
    }
};

export { bookHall, verifyHallBooking, listBookings, updateBookingStatus, removeBooking, updatePrices, getPrices };
