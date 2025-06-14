const express = require("express");
const userpayment = require("../database/Schema/userPayment");
const router = express.Router();

// Route to create a new order
router.post("/", async (req, res) => {
  const {
    requestedBy,
    phoneNumber,
    materialId,
    itemDescription,
    supplier,
    quantity,
    unitOfMeasure,
    unitPrice,
    paidAmount,
    paymentType,
    chequeNumber,
    remainingBalance,
    site,
    project,
  } = req.body;

  try {
    // ✅ 1. Check for missing required fields
    if (
      !requestedBy ||
      !phoneNumber ||
      !materialId ||
      !itemDescription ||
      !supplier ||
      !quantity ||
      !unitOfMeasure ||
      !unitPrice ||
      !paidAmount ||
      !paymentType ||
      !site ||
      !project
    ) {
      return res.status(400).json({
        error: "All fields are required.",
      });
    }
    // ✅ 2. Check if quantity and unitPrice are valid numbers
    if (
      isNaN(quantity) ||
      isNaN(unitPrice) ||
      quantity <= 0 ||
      unitPrice <= 0
    ) {
      return res.status(400).json({
        error: "Quantity and unit price must be valid positive numbers.",
      });
    }

    // ✅ 3. Calculate total price
    const totalPrice = quantity * unitPrice;

    // ✅ 4. Check that paidAmount is not greater than totalPrice
    if (paidAmount > totalPrice) {
      return res.status(400).json({
        error: "Paid amount cannot be greater than total price.",
      });
    }

    // ✅ 5. Calculate remainingBalance and check consistency
    const calculatedRemaining = totalPrice - paidAmount;

    // Check if paidAmount + remainingBalance does not equal totalPrice
    if (
      parseFloat(paidAmount) + parseFloat(remainingBalance) !==
      parseFloat(totalPrice)
    ) {
      return res.status(400).json({
        error:
          "The sum of paid amount and remaining balance must equal the total price.",
      });
    }

    // Additional check: If paidAmount equals totalPrice, remainingBalance must be 0
    if (
      parseFloat(paidAmount) === parseFloat(totalPrice) &&
      parseFloat(remainingBalance) !== 0
    ) {
      return res.status(400).json({
        error:
          "If the paid amount equals the total price, the remaining balance must be 0.",
      });
    }

    // Final check: Ensure remainingBalance is correct and consistent
    if (calculatedRemaining !== parseFloat(remainingBalance)) {
      return res.status(400).json({
        error: "Remaining balance is incorrect.",
      });
    }

    // ✅ 6. Create the new payment/order
    const newOrder = new userpayment({
      requestedBy,
      phoneNumber,
      materialId,
      itemDescription,
      supplier,
      quantity,
      unitOfMeasure,
      unitPrice,
      paidAmount,
      paymentType,
      chequeNumber,
      remainingBalance: calculatedRemaining,
      site,
      project,
      totalPrice,
    });

    // ✅ 7. Save to database
    await newOrder.save();

    return res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ error: "Failed to create order" });
  }
});

// GET Route to fetch all orders (Populates 'requestedBy' to show user details)
router.get("/paid", async (req, res) => {
  try {
    const orders = await userpayment.find(); // Fetch orders without populate
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
});

// Route to approve order (Status change to 'Approved')
router.put("/:orderId/approve", async (req, res) => {
  try {
    const { orderId } = req.params;

    // Fetch the order details
    const order = await userpayment.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the order status to "Approved"
    const updatedOrder = await userpayment.findByIdAndUpdate(
      orderId,
      { status: "Approved" },
      { new: true }
    );

    return res.status(200).json({
      message: "Order approved successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error approving order:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

// Route to mark the order as 'Paid'
router.put("/:orderId/markAsPaid", async (req, res) => {
  try {
    const { orderId } = req.params;

    // Fetch the order details
    const order = await userpayment.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the order status to "Paid"
    const updatedOrder = await userpayment.findByIdAndUpdate(
      orderId,
      { status: "Paid" },
      { new: true }
    );

    // Return success response with updated order
    res.status(200).json({
      message: "Order marked as paid successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error marking order as paid:", error);
    return res.status(500).json({
      message: "Failed to mark order as paid",
      error: error.message,
    });
  }
});

const buildMatchQuery = (project, site) => {
  const match = { status: "Paid" };
  if (project) match.project = project;
  if (site) match.site = site;
  return match;
};

// Get monthly payment performance (include all 12 months)
router.get("/performance", async (req, res) => {
  const { project, site } = req.query;

  try {
    const match = buildMatchQuery(project, site);

    const performanceData = await userpayment.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalPaid: { $sum: "$paidAmount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Create a complete list of months for the relevant years
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Get all years in your data
    const years = Array.from(new Set(performanceData.map((d) => d._id.year)));

    let filledData = [];

    for (const year of years) {
      for (let m = 1; m <= 12; m++) {
        const existing = performanceData.find(
          (d) => d._id.year === year && d._id.month === m
        );
        filledData.push({
          month: `${monthNames[m - 1]} ${year}`,
          totalPaid: existing ? existing.totalPaid : 0,
        });
      }
    }

    res.json(filledData);
  } catch (error) {
    console.error("Error fetching performance data:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// 1. Monthly Spending (Line Chart)
router.get("/performance/monthly-spending", async (req, res) => {
  try {
    const result = await userpayment.aggregate([
      { $match: { status: "Paid" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: "$paidAmount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formatted = result.map((item) => ({
      month: `${months[item._id.month - 1]} ${item._id.year}`,
      amount: item.total,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Error loading monthly spending", err });
  }
});

// 2. Payment Type Breakdown (Pie Chart)
router.get("/performance/payment-types", async (req, res) => {
  const { project, site } = req.query;

  try {
    const match = buildMatchQuery(project, site);

    const result = await userpayment.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$paymentType",
          value: { $sum: "$paidAmount" },
        },
      },
    ]);

    const formatted = result.map((item) => ({
      type: item._id || "Unknown",
      value: item.value,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching payment types:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// 3. Top Suppliers (Bar Chart)
router.get("/performance/top-suppliers", async (req, res) => {
  const { project, site } = req.query;

  try {
    const match = buildMatchQuery(project, site);

    const result = await userpayment.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$supplier",
          totalPaid: { $sum: "$paidAmount" },
        },
      },
      { $sort: { totalPaid: -1 } },
      { $limit: 10 },
    ]);

    const formatted = result.map((item) => ({
      supplier: item._id || "Unknown",
      totalPaid: item.totalPaid,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching top suppliers:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// GET: /api/userpayment/filters
router.get("/filters", async (req, res) => {
  try {
    const projects = await userpayment.distinct("project");
    const sites = await userpayment.distinct("site");

    res.json({ projects, sites });
  } catch (error) {
    console.error("Error fetching filter options:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;
