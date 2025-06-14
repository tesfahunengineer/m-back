require("dotenv").config();
const mongoose = require("mongoose");
const vendorSchema = require("./Schema/vendor");
const bcrypt = require("bcryptjs");

async function connectToMongoDB() {
  try {
    await mongoose.connect(
      process.env.URL
      //    {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
      //   serverSelectionTimeoutMS: 5000,
      //   family: 4, // Force IPv4, avoid IPv6 DNS issues
      // }
    );
    console.log("Connected to MongoDB...");
  } catch (e) {
    console.log("MongoDB connection error:", e);
  }
}

const vendor = mongoose.model("Vendor", vendorSchema);

async function emailExists({ email }) {
  const foundVendor = await vendor.findOne({ email: email });
  return foundVendor;
}

async function hashPassword(password, saltRounds) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.error("Error hashing password: ", err);
        reject();
      } else {
        resolve(hash);
      }
    });
  });
}

async function verifyPassword(password, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, result) => {
      if (err) {
        console.error("Error verifying password: ", err);
        reject();
      } else {
        resolve(result);
      }
    });
  });
}

async function createVendor({
  name,
  contactDetails,
  address,
  email,
  password,
  role,
  onTimeDeliveryRate,
  qualityRatingAvg,
  averageResponseTime,
  fulfillmentRate,
}) {
  const hashPass = await hashPassword(password, 10);
  const vendorData = {
    name,
    contactDetails,
    address,
    email,
    password: hashPass,
    role,
  };

  if (onTimeDeliveryRate !== undefined) {
    vendorData.onTimeDeliveryRate = onTimeDeliveryRate;
  }
  if (qualityRatingAvg !== undefined) {
    vendorData.qualityRatingAvg = qualityRatingAvg;
  }
  if (averageResponseTime !== undefined) {
    vendorData.averageResponseTime = averageResponseTime;
  }
  if (fulfillmentRate !== undefined) {
    vendorData.fulfillmentRate = fulfillmentRate;
  }

  return vendor.create(vendorData);
}

module.exports = {
  connectToMongoDB,
  vendor,
  emailExists,
  createVendor,
  hashPassword,
  verifyPassword,
};
