import * as yup from "yup";

export const transferSchema = yup.object({
  userid: yup
    .number()
    .typeError("Recipient User ID must be a number")
    .positive("User ID must be positive")
    .integer("User ID must be an integer")
    .required("Recipient User ID is required"),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .required("Amount is required")
    .positive("Amount must be positive")
    .integer("Amount must be an integer")
    .min(1, "Amount must be at least 1"),
  remarks: yup.string().optional(),
});

export const redeemSchema = yup.object({
  userid: yup
    .number()
    .typeError("Recipient User ID must be a number")
    .positive("User ID must be positive")
    .integer("User ID must be an integer")
    .required("Recipient User ID is required"),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .required("Amount is required")
    .positive("Amount must be positive")
    .integer("Amount must be an integer")
    .min(1, "Amount must be at least 1"),
  remarks: yup.string().optional(),
});
