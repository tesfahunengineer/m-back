const zod = require("zod");

const vendorUpdateBody = zod.object({
  name: zod.string().max(30).optional(),
  contactDetails: zod.string().optional(),
  address: zod.string().optional(),
  password: zod.string().min(8).optional(),
  onTimeDeliveryRate: zod.number().optional(),
  qualityRatingAvg: zod.number().optional(),
  averageResponseTime: zod.number().optional(),
  fulfillmentRate: zod.number().optional(),
});

const purchaseOrderUpdateBody = zod.object({
  poNumber: zod.string().optional(),
  vendor: zod.string().optional(),
  orderDate: zod.date().optional(),
  deliveryDate: zod.date().optional(),
  expectedDeliveryDate: zod.date().optional(),
  items: zod.object({}).optional(),
  quantity: zod.number().optional(),
  status: zod.enum(["pending", "completed", "cancelled"]).optional(),
  qualityRating: zod.number().optional(),
  issueDate: zod.date().optional(),
  acknowledgementDate: zod.date().optional(),
});

module.exports = {
  vendorUpdateBody,
  purchaseOrderUpdateBody,
};
