import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editPromotionSchema as schema } from "./constants.js";
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
  MenuItem
} from "@mui/material";

import FormCard from "../../components/common/FormCard.jsx";
import api from "../../api/api.js";
import PeopleIcon from "@mui/icons-material/People";
import { useToast } from "../../context/ToastContext.jsx";
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function EditPromotionForm({
  promotion,
  onClose,
  refetch = null,
}) {
  const { showToast } = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: promotion.name,
      description: promotion.description,
      startTime: dayjs(promotion.startTime),
      endTime: dayjs(promotion.endTime),
      minSpending: promotion.minSpending,
      type: promotion.type,
      rate: promotion.rate,
      points: promotion.points,
    },
  });

  const hasFormChanged = (formData) => {
    return (
      formData.name !== promotion.name ||
      formData.description !== promotion.description ||
      formData.startTime.toISOString() !== promotion.startTime ||
      formData.endTime.toISOString() !== promotion.endTime ||
      formData.type !== promotion.type ||
      Number(formData.minSpending) !== promotion.minSpending || 
      Number(formData.rate) !== promotion.rate ||
      Number(formData.points) !== promotion.points
    );
  };

  const queryClient = useQueryClient();
  
  const updatePromotionMutation = useMutation({
    mutationFn: async (payload) => {
        const res = await api.patch(`/promotions/${promotion.id}`, payload);
        return res.data;
    },
    onSuccess: () => {
        showToast("Edit successful", "success");
        queryClient.invalidateQueries({ queryKey: ['promotion-details', String(promotion.id)] });
        onClose();
    },
    onError: (error) => {
        showToast(`Error: ${error.message || 'Failed to update promotion'}`, "error");
    }
    });

  const onSubmit = async (data) => {
    // Check for changes first
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
      type,
      minSpending,
      rate,
      points,
    } = data;
    const payload = {
      name: name,
      description: description,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      type: type,
      minSpending: Number(minSpending),
      rate: Number(rate),
      points: Number(points),
    };

    updatePromotionMutation.mutate(payload);

  };
  
  const isSmall = useMediaQuery("(max-width: 1170px)");
  const DateTimePickerComponent = isSmall
    ? MobileDateTimePicker
    : DesktopDateTimePicker;

  if (!promotion) {
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
      title={promotion.name}
      width="50%"
      showClose={true}
      onClose={(e) => {
        e.stopPropagation();
        onClose();
      }}
      fullWidth={!!onClose}
      keepForm={true}
      children={
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Editing {promotion.name}
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
                      label="Promotion Title"
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
                <Stack direction="row" spacing={2}>
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <TextField
                            {...field}
                            select
                            label="Type"
                            error={!!errors.type}
                            helperText={errors.type ? errors.type.message : ""}
                            fullWidth
                            >
                            <MenuItem value="onetime">one-time</MenuItem>
                            <MenuItem value="automatic">automatic</MenuItem>
                            </TextField>
                        )}
                    />
                    <Controller
                        name="minSpending"
                        control={control}
                        render={({ field }) => (
                            <TextField
                            {...field}
                            label="Minimum Spending"
                            type="number"
                            error={!!errors.minSpending}
                            helperText={errors.minSpending ? errors.minSpending.message : ""}
                            fullWidth
                            >
                            </TextField>
                        )}
                    />
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Controller
                    name="rate"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="rate"
                        type="number"
                        error={!!errors.rate}
                        helperText={
                          errors.rate ? errors.rate.message : ""
                        }
                        sx={{
                          width: "50%",
                        }}
                      />
                    )}
                  />
                  <Controller
                    name="points"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="points"
                        type="number"
                        error={!!errors.points}
                        helperText={
                          errors.points ? errors.points.message : ""
                        }
                        sx={{
                          width: "50%",
                        }}
                      />
                    )}
                  />
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
        </Box>
      }
    />
  );
}
