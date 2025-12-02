import * as yup from "yup";

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required("Enter your email")
    .matches(
      /@mail\.utoronto\.ca$/,
      "Email must be a valid @mail.utoronto.ca address"
    ),
});