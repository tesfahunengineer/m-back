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
      status,
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
    const roundedCalculatedTotal = parseFloat(calculatedTotal.toFixed(2));

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
      status: status || "Pending", // default status
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

// ✅ Update a material order (partial update allowed)
router.put("/:id", async (req, res) => {
  try {
    const updates = req.body; // allow partial updates

    // If updating numeric fields, validate them
    if (updates.quantity) updates.quantity = parseFloat(updates.quantity);
    if (updates.unitPrice) updates.unitPrice = parseFloat(updates.unitPrice);
    if (updates.totalPrice) updates.totalPrice = parseFloat(updates.totalPrice);

    // Validate total price only if quantity & unitPrice provided
    if (updates.quantity && updates.unitPrice) {
      const calculatedTotal = updates.quantity * updates.unitPrice;
      const roundedCalculatedTotal = parseFloat(calculatedTotal.toFixed(2));
      if (
        updates.totalPrice &&
        roundedCalculatedTotal !== updates.totalPrice
      ) {
        return res
          .status(400)
          .json({ message: "Error in Total Price: Your total price is incorrect." });
      }
    }

    const updatedOrder = await MaterialOrder.findByIdAndUpdate(
      req.params.id,
      updates,
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
