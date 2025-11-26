import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  Switch,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";

import FormCard from "../../components/common/FormCard.jsx";
import api from "../../api/api.js";
import useToast from "../../components/common/hooks/useToast.jsx";
import PeopleIcon from "@mui/icons-material/People";
export default function EditEventForm() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const { ToastComponent, showToast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      startTime: null,
      endTime: null,
      location: "",
      pointsRemain: 0,
      numGuests: 0,
      capacity: 0,
      published: false,
    },
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${eventId}`);
        setEvent(res.data);
        // Reset form with fetched data
        reset({
          name: res.data.name,
          description: res.data.description,
          startTime: dayjs(res.data.startTime),
          endTime: dayjs(res.data.endTime),
          location: res.data.location,
          pointsRemain: res.data.pointsRemain,
          capacity: res.data.capacity,
          numGuests: res.data.numGuests,
          published: res.data.published,
        });
      } catch (error) {
        showToast("Failed to fetch event data", "error");
        console.log(error);
      }
    };
    fetchEvent();
  }, [eventId]);

  const onSubmit = async (data) => {
    const {
      name,
      description,
      startTime,
      endTime,
      location,
      pointsRemain,
      capacity,
      published,
    } = data;
    const payload = {
      name: name,
      description: description,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      location: location,
      points: Number(pointsRemain),
      capacity: Number(capacity),
      published: published,
    };

    try {
      const res = await api.patch(`/events/${eventId}`, payload);
      if (res.status === 200) {
        showToast("Edit successful", "success");
        setEvent(res.data);
      } else {
        showToast("Edit event failed", "error");
      }
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Edit event failed";
      showToast(msg, "error");
    }
  };
  const isSmall = useMediaQuery("(max-width: 1170px)");
  const DateTimePickerComponent = isSmall
    ? MobileDateTimePicker
    : DesktopDateTimePicker;

  if (!event) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <FormCard
      title={event.name}
      width="50%"
      showClose={true}
      children={
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Editing {event.name}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack spacing={2} mt={4}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Event Title"
                      error={!!errors.name}
                      helperText={errors.name ? errors.name.message : ""}
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
                    name="startTime"
                    control={control}
                    render={({ field }) => (
                      <DateTimePickerComponent
                        {...field}
                        label="Start date"
                        slotProps={{
                          textField: {
                            helperText: errors.startTime
                              ? errors.startTime.message
                              : "",
                            error: !!errors.startTime,
                          },
                        }}
                        views={[
                          "year",
                          "month",
                          "day",
                          ...(!isSmall ? ["hours", "minutes"] : []),
                        ]}
                        sx={{ width: "50%" }}
                      />
                    )}
                  />
                  <Controller
                    name="endTime"
                    control={control}
                    render={({ field }) => (
                      <DateTimePickerComponent
                        {...field}
                        label="End date"
                        slotProps={{
                          textField: {
                            helperText: errors.endTime
                              ? errors.endTime.message
                              : "",
                            error: !!errors.endTime,
                          },
                        }}
                        sx={{ width: "50%" }}
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
                <Stack direction="row" spacing={2}>
                  <Controller
                    name="pointsRemain"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Points"
                        type="number"
                        error={!!errors.pointsRemain}
                        helperText={
                          errors.pointsRemain ? errors.pointsRemain.message : ""
                        }
                        sx={{
                          width: "50%",
                        }}
                      />
                    )}
                  />
                  <Controller
                    name="capacity"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Capacity"
                        type="number"
                        error={!!errors.capacity}
                        helperText={
                          errors.capacity ? errors.capacity.message : ""
                        }
                        sx={{
                          width: "50%",
                        }}
                      />
                    )}
                  />
                </Stack>
                <Stack
                  direction="row"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Controller
                    name="published"
                    control={control}
                    render={({ field: { value, ...field } }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            {...field}
                            checked={!!value}
                            size="large"
                            disabled={event.published}
                          />
                        }
                        label="Published"
                      />
                    )}
                  />
                  <Button
                    startIcon={<PeopleIcon />}
                    variant="contained"
                    color="secondary"
                  >
                    {isSmall ? "Manage users" : "Manage event users"}
                  </Button>
                </Stack>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </Stack>
            </LocalizationProvider>
          </form>
          {ToastComponent}
        </Box>
      }
    />
  );
}
