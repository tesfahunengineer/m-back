const mongoose = require("mongoose");

const materialOrderSchema = new mongoose.Schema(
  {
    materialId: { type: String, required: true },
    itemDescription: { type: String, required: true },
    supplier: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitOfMeasurement: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    orderDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "Approved", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const MaterialOrder = mongoose.model("MaterialOrder", materialOrderSchema);

module.exports = MaterialOrder;
