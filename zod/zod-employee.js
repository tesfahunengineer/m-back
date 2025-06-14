const { z } = require("zod");

const employeeSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  position: z.string().min(1, "Position is required"),
  department: z.string().min(1, "Department is required"),
  salary: z.number().min(0, "Salary must be a positive number").required(),
  phoneNumber: z.string().min(1, "Phone Number is required"),
});
module.exports = employeeSchema;
