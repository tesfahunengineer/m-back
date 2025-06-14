const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  read: {
    type: Boolean,
    default: false, // All new messages start as unread
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", messageSchema);
