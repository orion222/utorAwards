import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editEventSchema as schema } from "./constants.js";
import { useState } from "react";
import {
  GeoapifyContext,
  GeoapifyGeocoderAutocomplete,
} from "@geoapify/react-geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
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
  useTheme,
} from "@mui/material";

import api from "../../api/api.js";
import PeopleIcon from "@mui/icons-material/People";
import { useToast } from "../../context/ToastContext.jsx";

const defaultValues = {
  name: "",
  description: "",
  startTime: null,
  endTime: null,
  location: "",
  pointsRemain: 0,
  numGuests: 0,
  capacity: "None",
  published: false,
}
export default function EditEventForm({
  event = defaultValues,
  openEditEventModal,
  onClose,
  refetch = null,
  hideManageUsers = false,
  createMode = false,
}) {
  const theme = useTheme();
  const { showToast } = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: event.name,
      description: event.description,
      startTime: dayjs(event.startTime),
      endTime: dayjs(event.endTime),
      location: event.location,
      pointsRemain: event.points,
      numGuests: event.numGuests,
      capacity: event.capacity,
      published: event.published,
    },
  });

  const hasFormChanged = (formData) => {
    return (
      formData.name !== event.name ||
      formData.description !== event.description ||
      formData.startTime.toISOString() !== event.startTime ||
      formData.endTime.toISOString() !== event.endTime ||
      formData.location !== event.location ||
      Number(formData.pointsRemain) !== event.points ||
      Number(formData.capacity) !== event.capacity ||
      formData.published !== event.published
    );
  };

  const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
  const [locationValue, setLocationValue] = useState(event.location || "");
  const onSubmit = async (data) => {
    if (!hasFormChanged(data)) {
      showToast("No changes made", "info");
      onClose();
      return;
    }

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
      capacity: isNaN(capacity) ? null : Number(capacity),
    };
    if (published) {
      payload["published"] = published;
    }

    let action = '';
    try {
      let res;
      let successStatus = createMode ? 201 : 200;
      if (createMode) {
        res = await api.post(`/events`, payload);
        action = 'Create';
      }
      else {
        res = await api.patch(`/events/${event.id}`, payload);
        action = 'Edit'
      }

      if (res.status === successStatus) {
        showToast(`${action} successful`, "success");
        onClose();
        if (refetch) {
          refetch();
        }
      } else {
        showToast(`${action} event failed`, "error");
        console.log(res);
      }
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        `${action} event failed`;
      showToast(msg, "error");
      console.log(error);
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
        <Box>
          <Typography variant="h5" fontWeight="bold">
            {createMode ? "Create new event": `Editing ${event.name}`}
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
                          "hours",
                          "minutes",
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
                          "hours",
                          "minutes",
                        ]}
                      />
                    )}
                  />
                </Stack>
                <Controller
                  name="location"
                  control={control}
                  render={({field}) => (
                    <GeoapifyContext apiKey={apiKey}>

                      <Box sx={{ width: "100%" }}>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          Location
                        </Typography>

                        <Box
                          sx={{
                            width: "100%",
                            "& .geoapify-autocomplete-input": {
                              backgroundColor: theme.palette.background.paper,
                              boxSizing: "border-box",
                              padding: "16.5px 14px",
                              borderRadius: 1,
                              width: "100%",
                            },
                            "& .geoapify-input-wrapper": {
                              width: "100%",
                            },
                          }}
                        >
                          <GeoapifyGeocoderAutocomplete
                            placeholder="Enter address..."
                            lang="en"
                            limit={5}
                            value={locationValue}
                            onUserInput={(input) => {
                              setLocationValue(input);
                              field.onChange(input);
                            }}
                            placeSelect={(place) => {
                              const formatted = place?.properties?.formatted || "";
                              setLocationValue(formatted);
                              field.onChange(formatted);
                            }}
                          />
                        </Box>

                        {errors.location && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ mt: 0.5, display: "block" }}
                          >
                            {errors.location.message}
                          </Typography>
                        )}
                      </Box>
                    </GeoapifyContext>
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
                  {
                    !hideManageUsers && (

                      <Button
                        startIcon={<PeopleIcon />}
                        variant="contained"
                        color="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditEventModal()
                        }}
                      >
                        {isSmall ? "Manage users" : "Manage event users"}
                      </Button>
                    )
                  }
                </Stack>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : createMode ? "Create event": "Save Changes"}
                </Button>
              </Stack>
            </LocalizationProvider>
          </form>
        </Box>

  );
}
