import * as yup from "yup";
export const purchaseSchema = yup.object({
	transactionId: yup
		.number()
		.typeError("Transaction ID must be a number")
		.positive("Transaction ID must be positive")
		.required("Transaction ID is required")
});
