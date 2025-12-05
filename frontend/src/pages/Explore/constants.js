import * as yup from "yup";

export const createPromotionSchema = yup.object({
  name: yup.string().required("Event title is required"),
  description: yup
    .string()
    .required("Description is required"),
  startTime: yup
    .date()
    .min(new Date(), "Start time must be in the future")
    .required("Start time is required"),
  endTime: yup
    .date()
    .min(yup.ref("startTime"), "End time cannot be before start time")
    .required("End time is required"),
  type: yup
    .string()
    .required("Type is required")
    .oneOf(["one-time", "automatic"], "Type must be either 'one-time' or 'automatic'"),
  rate: yup
    .number()
    .nullable()
    .transform((value, original) => original === "" ? null : value)
    .typeError("Rate must be a number")
    .min(0, "Rate must be at least 0"),
  points: yup
    .number()
    .nullable()
    .transform((value, original) => original === "" ? null : value)
    .typeError("Points must be a number")
    .min(1, "Points must be at least 1"),
  minSpending: yup
    .number()
    .nullable()
    .transform((value, original) => original === "" ? null : value)
    .typeError("minimum spending must be a number")
});
