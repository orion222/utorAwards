import * as yup from "yup";
export const purchaseSchema = yup.object({
	utorid: yup
		.string()
		.matches(/^[a-zA-Z0-9]+$/, "Utorid must be alphanumeric")
		.min(7, "Utorid must be at least 7 characters")
		.max(8, "Utorid must be at most 8 characters")
		.required("UTORid is required"),
	spent: yup
		.number()
		.typeError("Purchase amount must be a number")
		.positive("Purchase amount must be positive")
		.required("Purchase amount is required"),
	promotionId: yup
		.string()
		.matches(/^$|^[1-9][0-9]*$/, "Promotion ID must be a positive integer")
		.optional(),
	remarks: yup.string().optional(),
});
