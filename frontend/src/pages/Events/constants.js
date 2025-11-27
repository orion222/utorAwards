import * as yup from "yup";

export const editEventSchema = yup.object({
  name: yup.string().required("Event title is required"),
  description: yup.string().required("Description is required"),
  startTime: yup
    .date()
    .min(new Date(), "Start time must be in the future")
    .required("Start time is required"),
  endTime: yup
    .date()
    .min(yup.ref("startTime"), "End time cannot be before start time")
    .required("End time is required"),
  location: yup.string().required("Location is required"),
  pointsRemain: yup
    .number()
    .typeError("Points must be a number")
    .min(0, "Points must be at least 0")
    .required("Points are required"),
  capacity: yup
    .number()
    .typeError("Capacity must be a number")
    .min(1, "Capacity must be at least 1")
    .required("Capacity is required"),
});
