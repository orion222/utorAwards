import * as yup from "yup";

export const passwordSchema = yup.object().shape({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password can be at most 20 characters long")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Confirm new password is required"),
});

export const profileSchema = yup.object().shape({
  name: yup
    .string()
    .required("Full Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .matches(/@mail\.utoronto\.ca$/, "Email must be a @mail.utoronto.ca address")
    .required("Email is required"),
  birthday: yup
    .date()
    .nullable()
    .transform((v) => (v instanceof Date && !isNaN(v) ? v : null))
    .max(new Date(), "Birthday cannot be in the future")
});
