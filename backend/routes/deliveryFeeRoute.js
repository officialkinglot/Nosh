import express from 'express';
import deliveryFeeModel from '../models/deliveryFeeModel.js';

const router = express.Router();

// Change Delivery Fee
router.post('/change-delivery-fee', async (req, res) => {
  try {
    const { deliveryFee } = req.body;
    const newFee = new deliveryFeeModel({
      fee: deliveryFee,
      date: new Date()
    });
    await newFee.save();
    res.json({ success: true, message: "Delivery fee changed successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error changing delivery fee" });
  }
});

// Fetch Delivery Fee
router.get('/delivery-fee', async (req, res) => {
  try {
    const latestFee = await deliveryFeeModel.findOne().sort({ date: -1 });
    if (!latestFee) {
      return res.json({ success: false, message: "Delivery fee not found" });
    }
    res.json({ success: true, deliveryFee: latestFee.fee });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching delivery fee" });
  }
});

export default router;
