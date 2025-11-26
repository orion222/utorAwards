import * as yup from "yup";
export const purchaseSchema = yup.object({
	utorid: yup
		.string()
		.matches(/^[a-zA-Z0-9]+$/, "Utorid must be alphanumeric")
		.min(7, "Utorid must be at least 7 characters")
		.max(8, "Utorid must be at most 8 characters")
		.required("UTORid is required"),
	name: yup
		.string()
		.required("Name is required"),
	email: yup
		.string()
		.email("Invalid email format")
		.matches(/@mail\.utoronto\.ca$/, "Email must be a @mail.utoronto.ca address")
		.required("Email is required"),
});
