// models/Order.js

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    requestedBy: {
      type: String,
      required: true, // Ensures every order is linked to a user
    },
    materialId: {
      type: String,
      required: true,
    },
    itemDescription: {
      type: String,
      required: true,
    },
    supplier: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unitOfMeasure: {
      type: String,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      required: true,
    },
    paymentType: {
      type: String,
      required: true,
      enum: ["Cash", "Bank Transfer", "Cheque"], // Allowed payment types
    },
    chequeNumber: {
      type: String,
      required: function () {
        return this.paymentType === "Cheque"; // Cheque number is required if payment type is 'Cheque'
      },
    },
    remainingBalance: {
      type: Number,
      required: true,
    },
    site: {
      type: String,
      required: true,
    },
    project: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "Approved", "cancelled"],
      default: "pending",
    },

    phoneNumber: {
      type: String,
      required: true,
      match: [/^\d{10,15}$/, "Please enter a valid phone number"], // Ensures valid phone format
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("UserPayment", orderSchema);
