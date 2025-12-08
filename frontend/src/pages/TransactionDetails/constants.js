import * as yup from "yup";

export const adjustmentSchema = yup.object().shape({
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .required("Amount is required"),

  promotionIds: yup
    .array()
    .of(
      yup
        .number()
        .typeError("Promotion ID must be a number")
    )
    .optional(),

  remark: yup.string().optional(),
});
