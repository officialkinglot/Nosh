import mongoose from 'mongoose';

const hallSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventType: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    numberOfGuests: { type: Number, required: true },
    additionalInfo: { type: String },
    amount: { type: Number, required: true },
    payment: { type: Boolean, default: false },
    status: { type: String, default: 'Pending' },
    phoneNumber: { type: String, required: true }, // Added phone number field
    bookedBy: { type: String, required: true }, // Added booked by field
}, { timestamps: true });

const hallModel = mongoose.model('Hall', hallSchema);

export default hallModel;
