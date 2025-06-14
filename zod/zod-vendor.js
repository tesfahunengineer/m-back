const z = require("zod");

const zodVendor = z.object({
  name: z.string().max(30),
  role: z.enum(["Admin", "User", "Casher"]),
  contactDetails: z.string(),
  address: z.string(),
  email: z
    .string()
    .email({ message: "Invalid email format, please enter a valid email" })
    .refine(
      (email) =>
        email.endsWith("@gmail.com") ||
        email.endsWith("@yahoo.com") ||
        email.endsWith("@outlook.com"),
      {
        message: "Email must be a Gmail, Yahoo, or Outlook account",
      }
    ),

  password: z
    .string()
    .min(8, { message: "Password must be greater than 8 characters" }),
});

module.exports = zodVendor;
