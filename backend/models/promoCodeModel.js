import mongoose from 'mongoose';

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true }, // Discount percentage
  expiresAt: { type: Date, required: true },
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Track users who have used the code
});

export default mongoose.model('PromoCode', promoCodeSchema);
