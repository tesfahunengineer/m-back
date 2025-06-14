const express = require("express");
const router = express.Router();
const Message = require("../database/Schema/Message");

// POST: Create new message
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const newMessage = new Message({ name, email, subject, message });
    await newMessage.save();

    return res.status(201).json({ message: "Message sent successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

// GET: All messages
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Failed to fetch messages:", error.message);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

// GET: Unread message count
router.get("/unread-count", async (req, res) => {
  try {
    const unreadCount = await Message.countDocuments({ read: false });
    res.status(200).json({ unreadCount });
  } catch (error) {
    res.status(500).json({ message: "Error fetching unread count" });
  }
});

// PATCH: Mark message as read
router.patch("/mark-as-read/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { read: true });
    res.status(200).json({ message: "Message marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Error updating message" });
  }
});

module.exports = router;
