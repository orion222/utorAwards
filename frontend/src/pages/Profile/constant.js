import * as yup from "yup";

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
