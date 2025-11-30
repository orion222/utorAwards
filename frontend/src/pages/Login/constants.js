import * as yup from "yup";

export const loginSchema = yup.object({
  utorid: yup
    .string()
    .trim()
    .required("Enter your UTORid"),

  password: yup
    .string()
    .trim()
    .required("Enter your password"),
});