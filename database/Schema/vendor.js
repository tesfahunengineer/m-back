const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 30,
  },
  role: {
    type: String,
    enum: ["Admin", "User", "Casher"],
    default: "User",
  },
  contactDetails: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  onTimeDeliveryRate: { type: Number, default: 0 },
  qualityRatingAvg: { type: Number, default: 0 },
  averageResponseTime: { type: Number, default: 0 },
  fulfillmentRate: { type: Number, default: 0 },
});

module.exports = vendorSchema;
