const mongoose = require("mongoose");
const vendorSchema = require("./vendor");

const vendor = mongoose.model("Vendor", vendorSchema); // model name is "Vendor"

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    employee: {
      type: String,
      required: true,
      trim: true,
    },
    task: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    file: {
      type: String, // store the path or URL of the uploaded file
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
