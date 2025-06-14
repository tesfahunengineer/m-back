const express = require("express");
const vendorRouter = require("./vendor");
const materialOrderRouter = require("./materialOrderRoute");
const projectRoute = require("./projectRoute");
const taskRoute = require("./taskRoute");
const paymentRoute = require("./paymentRoute");
const userPaymentRoute = require("./userPaymentRoute");
const employeeRoute = require("./employeeRoute");
const reportRoute = require("./reportRoute");
const message = require("./message");
const router = express.Router();

router.use("/vendors", vendorRouter);
router.use("/material_order", materialOrderRouter);
router.use("/projects", projectRoute);
router.use("/tasks", taskRoute);
router.use("/payment", paymentRoute);
router.use("/userpayment", userPaymentRoute);
router.use("/employee", employeeRoute);
router.use("/reports", reportRoute);
router.use("/contact", message);

module.exports = router;
