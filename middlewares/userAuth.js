const jwt = require("jsonwebtoken");
const { vendor } = require("../database");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    // Decode email instead of vendorCode
    const email = decoded.email; // Use email in the token
    const vendorData = await vendor.findOne({ email }); // Find vendor by email
    //console.log("Decoded email:", decoded.email);

    if (!vendorData) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    req.user = { id: vendorData._id.toString() }; // Attach user ID to the request object
    //console.log("Authenticated user ID:", vendorData._id.toString());

    next();
  });
}

module.exports = authMiddleware;
