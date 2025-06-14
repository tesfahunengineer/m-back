const express = require("express");
const vendorSchema = require("../database/Schema/vendor");
const {
  emailExists,
  createVendor,
  vendor,
  hashPassword,
} = require("../database");
const zodVendor = require("../zod/zod-vendor");
const signInBody = require("../zod/signInBody");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/userAuth");
const { vendorUpdateBody } = require("../zod/updateBody");
const router = express.Router();

const bcrypt = require("bcryptjs");
router.post("/", async (req, res) => {
  try {
    const { name, contactDetails, address, email, password } = req.body;

    // ✅ Check if any required field is missing
    if (!name || !contactDetails || !address || !email || !password) {
      return res.status(400).json({
        message: "Please fill out all required fields",
      });
    }

    const parseResult = zodVendor.safeParse(req.body);
    if (!parseResult.success) {
      const errors = parseResult.error.errors;
      return res.status(400).json({
        message: errors[0]?.message || "Invalid User data",
      });
    }

    const data = parseResult.data;
    const existingVendor = await emailExists(data);
    if (existingVendor) {
      return res.status(403).json({ message: "User already exists" });
    }
    //Check Admin Exist
    const { role } = data; // 👈 Add this line
    if (role === "Admin") {
      //  Register the model using the imported schema
      const Vendor = require("mongoose").model("Vendor", vendorSchema);
      // Now use the model properly
      const existingAdmin = await Vendor.findOne({ role: "Admin" });
      if (existingAdmin) {
        return res
          .status(400)
          .json({ error: "Admin already exists,You Are User" });
      }
    }
    //Check Casher Exist
    if (role === "Casher") {
      // Register the model using the imported schema
      const Vendor = require("mongoose").model("Vendor", vendorSchema);
      // Now use the model properly
      const existingAdmin = await Vendor.findOne({ role: "Casher" });
      if (existingAdmin) {
        return res
          .status(400)
          .json({ error: "Casher already exists,You Are User" });
      }
    }
    const newVendor = await createVendor(data);
    return res.status(201).json({
      message: "User created successfully",
      vendor: {
        name: newVendor.name,
        role: newVendor.role,
        email: newVendor.email,
      },
    });
  } catch (e) {
    console.error("Error creating user:", e.message || e);
    return res
      .status(500)
      .json({ message: "Failed to create user", error: e.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const vendors = await vendor.find({});
    return res.status(200).json({ vendors });
  } catch (e) {
    console.error("Error fetching user:", e);
    return res.status(500).json({ message: "Failed to fetch user" });
  }
});
router.post("/signin", async (req, res) => {
  try {
    // Validate the request body with Zod
    const parseResult = signInBody.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        message: "Invalid input data. Ensure email and password are correct.",
      });
    }

    const { email, password } = parseResult.data;

    // Check if the vendor exists in the database
    const existingVendor = await emailExists({ email });

    if (!existingVendor) {
      // If user doesn't exist
      return res.status(404).json({
        message: "User doesn't exist. Please sign up first.",
      });
    }

    // Compare the entered password with the stored hashed password
    const passwordMatch = await bcrypt.compare(
      password,
      existingVendor.password
    );
    if (!passwordMatch) {
      // If password is incorrect
      return res.status(403).json({
        message:
          "Incorrect password. Please check your password and try again.",
      });
    }

    // Generate JWT token for the vendor
    const token = jwt.sign(
      {
        email: existingVendor.email,
        role: existingVendor.role,
        id: existingVendor._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Set the token expiration time
    );

    // Return the response with the token and vendor information
    return res.status(200).json({
      token,
      role: existingVendor.role,
      name: existingVendor.name,
      id: existingVendor._id,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error during sign-in:", error);

    // Send a generic error response for server issues
    return res.status(500).json({
      message:
        "An error occurred while processing your sign-in request. Please try again later.",
    });
  }
});

router.get("/:vendorCode", async (req, res) => {
  try {
    const email = req.params.email;
    const foundVendor = await vendor.findOne({ email });
    if (!foundVendor) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ foundVendor });
  } catch (e) {
    console.error("Error during retrieving vendor details", e);
    return res
      .status(500)
      .json({ message: "Failed to retrieve vendor details." });
  }
});

router.put("/:vendorCode", authMiddleware, async (req, res) => {
  try {
    const vendorCode = req.params.vendorCode;
    const { success, data } = vendorUpdateBody.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ message: "Invalid user data" });
    }

    if (data.password) {
      data.password = await hashPassword(data.password, 10);
    }

    const updateSuccess = await vendor.updateOne({ vendorCode }, data);
    if (updateSuccess.nModified === 0) {
      return res
        .status(404)
        .json({ message: "User not found or no changes were made." });
    }

    return res
      .status(200)
      .json({ message: "Successfully updated User details." });
  } catch (e) {
    console.error("Error while updating vendor details: ", e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/:vendorCode", authMiddleware, async (req, res) => {
  try {
    const vendorCode = req.params.vendorCode;
    const success = await vendor.deleteOne({ vendorCode });
    if (success.deletedCount === 0) {
      return res.status(404).json({ message: "Error deleting vendor" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (e) {
    console.error("Error while deleting vendor details: ", e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:vendorCode/performance", authMiddleware, async (req, res) => {});

module.exports = router;
