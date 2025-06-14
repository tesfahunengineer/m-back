const express = require("express");
const router = express.Router();
const Employee = require("../database/Schema/employee"); // Assuming employee.model.js is in the models folder

// Create a new employee
// Helper function to calculate age from DOB
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

router.post("/", async (req, res) => {
  const {
    employeeId,
    firstName,
    middleName,
    lastName,
    gender,
    dateOfBirth,
    email,
    position,
    department,
    salary,
    hireDate,
    phoneNumber,
    projectWorking,
    siteWorking,
  } = req.body;

  try {
    // ✅ Check if employeeId already exists
    const existingEmployeeId = await Employee.findOne({ employeeId });
    if (existingEmployeeId) {
      return res.status(400).json({ message: "EmployeeId Exists" });
    }

    // ✅ Check if email already exists
    const existingEmail = await Employee.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email exists use other email" });
    }

    // ✅ Check if age is less than 18
    const age = calculateAge(dateOfBirth);
    if (age < 18) {
      return res
        .status(400)
        .json({ message: "Employee age must be greater than 18" });
    }

    // ✅ Create new employee if all checks pass
    const newEmployee = new Employee({
      employeeId,
      firstName,
      middleName,
      lastName,
      gender,
      dateOfBirth,
      email,
      position,
      department,
      salary,
      hireDate,
      phoneNumber,
      projectWorking,
      siteWorking,
    });

    await newEmployee.save();

    res.status(201).json({
      message: "Employee added successfully!",
      employee: newEmployee,
    });
  } catch (error) {
    console.error("Error adding employee:", error);
    res.status(500).json({ message: "Failed to add employee." });
  }
});

// Get all employees
router.get("/list", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(400).json({ error: "Failed to retrieve employees" });
  }
});

// Get a single employee by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find by custom field like employeeId, not by MongoDB _id
    const employee = await Employee.findOne({ employeeId: id });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(400).json({ error: "Failed to retrieve employee" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params; // id refers to employeeId here

  try {
    // Find and update the employee using the custom field `employeeId`
    const updatedEmployee = await Employee.findOneAndUpdate(
      { employeeId: id }, // Find by custom employeeId field
      req.body, // The fields to update
      { new: true } // Return the updated document
    );

    if (!updatedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res
      .status(200)
      .json({ message: "Employee updated successfully", updatedEmployee });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(400).json({ error: "Failed to update employee" });
  }
});

// Delete an employee by custom employeeId
router.delete("/:id", async (req, res) => {
  try {
    const deletedEmployee = await Employee.findOneAndDelete({
      employeeId: req.params.id,
    });
    if (!deletedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res
      .status(200)
      .json({ message: "Employee deleted successfully", deletedEmployee });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(400).json({ error: "Failed to delete employee" });
  }
});

module.exports = router;
