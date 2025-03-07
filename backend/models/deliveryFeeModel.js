import mongoose from 'mongoose';

const deliveryFeeSchema = new mongoose.Schema({
  fee: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const DeliveryFee = mongoose.model('DeliveryFee', deliveryFeeSchema);

export default DeliveryFee;
