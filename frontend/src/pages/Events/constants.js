import * as yup from "yup";

export const editEventSchema = yup.object({
  event_title: yup.string().required("Event title is required"),
  description: yup.string().required("Description is required"),
  start_date: yup.date().required("Start date is required"),
  end_date: yup
    .date()
    .min(yup.ref("start_date"), "End date cannot be before start date")
    .required("End date is required"),
  location: yup.string().required("Location is required"),
  points: yup
    .number()
    .min(0, "Points must be at least 0")
    .required("Points are required"),
});
