import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editEventSchema as schema } from "./constants.js";
import {
  DesktopDateTimePicker,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import {
  Stack,
  Box,
  TextField,
  Button,
  Typography,
  useMediaQuery,
} from "@mui/material";

import FormCard from "../../components/common/FormCard.jsx";
const eventData = {
  id: 1,
  name: "pan chen hangout",
  description: "test",
  location: "markham",
  startTime: "2011-10-05T14:48:00.000Z",
  endTime: "2026-10-27T02:36:43.340Z",
  capacity: 1,
  pointsRemain: 60,
  pointsAwarded: 0,
  published: false,
  organizers: [],
  guests: [],
};
export default function EditEventForm() {
  const [event, setEvent] = useState(eventData);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      event_title: event.name,
      description: event.description,
      start_date: dayjs(event.startTime),
      end_date: dayjs(event.endTime),
      location: event.location,
      points: event.pointsRemain,
    },
  });

  const onSubmit = async (data) => {
    console.log("Submitted Data:", data);
  };
  const isSmall = useMediaQuery("(max-width: 1170px)");
  const DateTimePickerComponent = isSmall
    ? MobileDateTimePicker
    : DesktopDateTimePicker;
  return (
    <FormCard
      title={event.name}
      width="50%"
      children={
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Editing {event.name}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} mt={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="event_title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Event Title"
                      error={!!errors.event_title}
                      helperText={
                        errors.event_title ? errors.event_title.message : ""
                      }
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Description"
                      error={!!errors.description}
                      helperText={
                        errors.description ? errors.description.message : ""
                      }
                      fullWidth
                      multiline
                      rows={2}
                    />
                  )}
                />
                <Stack direction="row" spacing={2}>
                  <Controller
                    name="start_date"
                    control={control}
                    render={({ field }) => (
                      <DateTimePickerComponent
                        {...field}
                        label="Start date"
                        slotProps={{
                          textField: {
                            helperText: errors.start_date
                              ? errors.start_date.message
                              : "",
                            error: !!errors.start_date,
                          },
                        }}
                        fullWidth
                        defaultValue={event.start_date}
                        views={[
                          "year",
                          "month",
                          "day",
                          ...(!isSmall ? ["hours", "minutes"] : []),
                        ]}
                      />
                    )}
                  />
                  <Controller
                    name="end_date"
                    control={control}
                    render={({ field }) => (
                      <DateTimePickerComponent
                        {...field}
                        label="End date"
                        slotProps={{
                          textField: {
                            helperText: errors.end_date
                              ? errors.end_date.message
                              : "",
                            error: !!errors.end_date,
                          },
                        }}
                        fullWidth
                        defaultValue={event.end_date}
                        views={[
                          "year",
                          "month",
                          "day",
                          ...(!isSmall ? ["hours", "minutes"] : []),
                        ]}
                      />
                    )}
                  />
                </Stack>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Location"
                      error={!!errors.location}
                      helperText={
                        errors.location ? errors.location.message : ""
                      }
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="points"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Points"
                      type="number"
                      error={!!errors.points}
                      helperText={errors.points ? errors.points.message : ""}
                      sx={{
                        width: "50%",
                      }}
                    />
                  )}
                />
                <Button
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  onClick={handleSubmit((data) => {
                    console.log("Form Data:", data);
                  })}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </LocalizationProvider>
            </Stack>
          </form>
        </Box>
      }
    />
  );
}
