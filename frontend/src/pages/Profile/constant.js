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
  birthYear: yup
    .number()
    .typeError("Year is required").required("Year is required"),
  birthMonth: yup
    .number()
    .typeError("Month is required").required("Month is required"),
  birthDay: yup
    .number()
    .typeError("Day is required").required("Day is required"),
});
