import mongoose from 'mongoose';

const priceSchema = new mongoose.Schema({
  eventType: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
});

const Price = mongoose.model('Price', priceSchema);

export default Price;
