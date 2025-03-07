import mongoose from "mongoose";
import moment from 'moment-timezone';

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
      }
    ],
    amount: { type: Number, required: true },
    address: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      phone: { type: String, required: true }
    },
    payment: { type: Boolean, default: false },
    status: { type: String, default: 'Food Order Processing' },
    orderDateTime: { type: String, default: () => moment().tz('Africa/Lagos').format('MMMM Do, YYYY [at] h:mm A') }, // Unique order timestamp
    dispatcher: {
      name: { type: String },
      phone: { type: String },
    },
    pickupTime: { type: Date }, // Add pickupTime field
    deliveryTime: { type: Date } // Add deliveryTime field
  },
  { timestamps: true }
);

// Middleware to set orderDateTime when the order is created
orderSchema.pre('save', function(next) {
  if (this.isNew) {
    this.orderDateTime = moment().tz('Africa/Lagos').format('MMMM Do, YYYY [at] h:mm A');
  }
  next();
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
