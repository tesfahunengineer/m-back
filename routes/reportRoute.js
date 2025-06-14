const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/userAuth");
const Report = require("../database/Schema/reportSchema");
const upload = require("../middlewares/upload"); // ✅ Import multer config

// GET all reports
router.get("/allreport", async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

// GET reports only for the logged-in vendor
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const reports = await Report.find({ userId });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports" });
  }
});

// ✅ POST with file upload
router.post("/", authMiddleware, upload.single("file"), async (req, res) => {
  const { employee, task, date } = req.body;
  const userId = req.user.id;

  if (!userId || !employee || !task || !date) {
    return res.status(400).json({ error: "All Fields Are Required" });
  }

  try {
    const newReport = new Report({
      userId,
      employee,
      task,
      date,
      file: req.file ? req.file.path : null, // ✅ Save file path
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (error) {
    console.error("Error saving report:", error);
    res.status(500).json({ error: "Failed to save report" });
  }
});

module.exports = router;
