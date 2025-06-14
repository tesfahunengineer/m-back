const express = require("express");
const Payment = require("../database/Schema/paymentSchema"); // Import the Payment model
const router = express.Router();

// Route to handle payment submission
router.post("/", async (req, res) => {
  const {
    materialName,
    quantity,
    measurement,
    paidAmount,
    paymentType,
    paymentDate,
    paymentReason,
  } = req.body;

  try {
    // Create a new payment document
    const newPayment = new Payment({
      materialName,
      quantity,
      measurement,
      paidAmount,
      paymentType,
      paymentDate,
      paymentReason,
    });

    // Save the payment to the database
    await newPayment.save();

    res.status(201).json({
      message: "Payment saved successfully",
      payment: newPayment,
    });
  } catch (error) {
    console.error("Error saving payment:", error);
    res.status(500).json({ message: "Error saving payment" });
  }
});

module.exports = router;
