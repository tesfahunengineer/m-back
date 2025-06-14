const mongoose = require("mongoose");

// Define the Payment schema
const paymentSchema = new mongoose.Schema({
  materialName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number, // Consider using Number if quantity should be numeric
    required: true,
  },
  measurement: {
    // Corrected the typo here
    type: String,
    required: true,
  },
  paidAmount: {
    // New field
    type: Number,
    required: true,
  },
  paymentType: {
    type: String,
    enum: ["Cash", "Transfer", "Check"],
    required: true,
  },
  paymentDate: {
    type: Date,
    required: true,
  },
  paymentReason: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a Payment model
const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
