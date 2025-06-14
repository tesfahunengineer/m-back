const EventEmitter = require("events");
const { purchaseOrder, vendor } = require("../database");

const eventEmitter = new EventEmitter();

function setUpEvents() {
  eventEmitter.on("Calculate On-Time Delivery Rate", async (vendorCode) => {
    const completedOrdersOnTime = await purchaseOrder.countDocuments({
      vendor: vendorCode,
      status: "completed",
      deliveryDate: { $lte: expectedDeliveryDate },
    });
    const totalCompletedOrders = await purchaseOrder.countDocuments({
      vendor: vendorCode,
      status: "completed",
    });

    const onTimeDeliveryRate = completedOrdersOnTime / totalCompletedOrders;

    await vendor.updateOne(
      { vendorCode },
      { onTimeDeliveryRate: onTimeDeliveryRate }
    );
  });

  eventEmitter.on("Calculate Quality Rating Average", (vendorCode) => {});

  eventEmitter.on("Calculate Average Response Time", (vendorCode) => {});

  eventEmitter.on("Calculate Fulfilment Rate", (vendorCode) => {});
}

module.exports = {
  eventEmitter,
  setUpEvents,
};
