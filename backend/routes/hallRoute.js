 // hallRouter.js
import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { bookHall, verifyHallBooking, listBookings, updateBookingStatus, removeBooking, updatePrices, getPrices } from '../controllers/hallController.js';

const hallRouter = express.Router();

// Endpoints
hallRouter.post('/book', authMiddleware, bookHall);
hallRouter.post('/verify', verifyHallBooking);
hallRouter.get('/list', listBookings);
hallRouter.put('/update-status', updateBookingStatus);
hallRouter.delete('/remove', removeBooking);
hallRouter.put('/update-prices', updatePrices);
hallRouter.get('/prices', getPrices); // New endpoint to fetch prices

export default hallRouter;
