const mongoose = require("mongoose");

// Define the Employee schema
const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
    required: false, // Middle name is optional
  },
  lastName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  position: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  hireDate: {
    type: Date,
    default: Date.now,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  projectWorking: {
    type: String,
    required: false,
  },
  siteWorking: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create an Employee model
const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
