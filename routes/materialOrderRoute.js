const express = require("express");
const router = express.Router();
const MaterialOrder = require("../database/Schema/materialOrderSchema");

// ✅ Create a new material order
router.post("/", async (req, res) => {
  try {
    const {
      materialId,
      itemDescription,
      supplier,
      quantity,
      unitOfMeasurement,
      unitPrice,
      totalPrice,
      orderDate,
      items,
    } = req.body;

    // Check for missing required fields
    if (
      !materialId ||
      !itemDescription ||
      !supplier ||
      !quantity ||
      !unitOfMeasurement ||
      !unitPrice ||
      !totalPrice ||
      !orderDate
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Ensure numeric values are valid numbers
    const parsedQuantity = parseFloat(quantity);
    const parsedUnitPrice = parseFloat(unitPrice);
    const parsedTotalPrice = parseFloat(totalPrice);

    if (
      isNaN(parsedQuantity) ||
      isNaN(parsedUnitPrice) ||
      isNaN(parsedTotalPrice)
    ) {
      return res.status(400).json({
        message: "Quantity, Unit Price, and Total Price must be valid numbers.",
      });
    }

    // Check total price calculation
    const calculatedTotal = parsedQuantity * parsedUnitPrice;
    const roundedCalculatedTotal = parseFloat(calculatedTotal.toFixed(2)); // optional precision fix

    if (roundedCalculatedTotal !== parsedTotalPrice) {
      return res.status(400).json({
        message: "Error in Total Price: Your total price is incorrect",
      });
    }

    // Create and save new material order
    const newMaterialOrder = new MaterialOrder({
      materialId,
      itemDescription,
      supplier,
      quantity: parsedQuantity,
      unitOfMeasurement,
      unitPrice: parsedUnitPrice,
      totalPrice: parsedTotalPrice,
      orderDate,
      items,
    });

    await newMaterialOrder.save();

    return res.status(201).json({
      message: "Material Request created successfully",
      order: newMaterialOrder,
    });
  } catch (error) {
    console.error("Error creating material order:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// ✅ Fetch all material orders
router.get("/allList", async (req, res) => {
  try {
    const materialOrders = await MaterialOrder.find();
    res.status(200).json(materialOrders);
  } catch (error) {
    console.error("Error fetching material orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Fetch a specific material order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await MaterialOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Material order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching material order:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update a material order
router.put("/:id", async (req, res) => {
  try {
    const {
      materialId,
      itemDescription,
      supplier,
      quantity,
      unitOfMeasurement,
      unitPrice,
      totalPrice,
      orderDate,
      items,
    } = req.body;

    // Validate required fields
    if (
      !materialId ||
      !itemDescription ||
      !supplier ||
      !quantity ||
      !unitOfMeasurement ||
      !unitPrice ||
      !totalPrice ||
      !orderDate
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Parse numeric values
    const parsedQuantity = parseFloat(quantity);
    const parsedUnitPrice = parseFloat(unitPrice);
    const parsedTotalPrice = parseFloat(totalPrice);

    if (
      isNaN(parsedQuantity) ||
      isNaN(parsedUnitPrice) ||
      isNaN(parsedTotalPrice)
    ) {
      return res.status(400).json({
        message: "Quantity, Unit Price, and Total Price must be valid numbers.",
      });
    }

    // Validate total price
    const calculatedTotal = parsedQuantity * parsedUnitPrice;
    const roundedCalculatedTotal = parseFloat(calculatedTotal.toFixed(2));

    if (roundedCalculatedTotal !== parsedTotalPrice) {
      return res.status(400).json({
        message: "Error in Total Price: Your total price is incorrect.",
      });
    }

    // Proceed to update
    const updatedOrder = await MaterialOrder.findByIdAndUpdate(
      req.params.id,
      {
        materialId,
        itemDescription,
        supplier,
        quantity: parsedQuantity,
        unitOfMeasurement,
        unitPrice: parsedUnitPrice,
        totalPrice: parsedTotalPrice,
        orderDate,
        items,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Material request not found" });
    }

    return res.status(200).json({
      message: "Material request updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating material order:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// ✅ Delete a material order
router.delete("/:id", async (req, res) => {
  try {
    const deletedOrder = await MaterialOrder.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Material order not found" });
    }

    res.status(200).json({ message: "Material order deleted successfully" });
  } catch (error) {
    console.error("Error deleting material order:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
