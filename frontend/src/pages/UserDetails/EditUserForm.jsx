import { useState } from 'react';
import {
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  Typography,
  Stack,
  Switch,
  useMediaQuery
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormCard from '../../components/common/FormCard';
import { roleOptions, userSchema } from './constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../context/ToastContext';
import api from '../../api/api';
import {
  DesktopDatePicker,
  MobileDatePicker,
} from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

function EditUserForm({ user, onClose, onSubmit }) {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || 'regular',
      birthday: user?.birthday ? dayjs(user.birthday) : null,
      hideUtorid: user?.hideUtorid || false,
      suspicious: user?.suspicious || false
    },
    mode: 'onBlur',
  });

  const editUserMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.patch(`/users/${user.id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      showToast("Update successful", "success");
      queryClient.invalidateQueries({ queryKey: ['user-details', String(user.id)] });
      onClose();
    },
    onError: (error) => {
      showToast(`Error: ${error.message || 'Failed to update user'}`, "error");
    }
  });

  const onSubmitHandler = async (data) => {
    const birthdayString = data.birthday ? dayjs(data.birthday).format("YYYY-MM-DD") : null;
    const payload = {
      name: data.name === user?.name ? null : data.name,
      email: data.email === user?.email ? null : data.email,
      role: data.role === user?.role ? null : data.role,
      birthday: birthdayString === user?.birthday ? null : birthdayString,
      hideUtorid: data.hideUtorid === user?.hideUtorid ? null : data.hideUtorid,
      suspicious: data.suspicious === user?.suspicious ? null : data.suspicious
    };

    editUserMutation.mutate(payload);
  };

  const isSmall = useMediaQuery("(max-width: 600px)");
  const DatePickerComponent = isSmall
    ? MobileDatePicker
    : DesktopDatePicker;

  return (
    <FormCard onClose={onClose}>
      <Typography variant="h5" component="h2" gutterBottom>
        Edit User
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} sx={{ mt: 2 }}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Name"
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              margin="normal"
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Email"
              type="email"
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              margin="normal"
            />
          )}
        />

        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              select
              label="Role"
              error={Boolean(errors.role)}
              helperText={errors.role?.message}
              margin="normal"
            >
              {roleOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Controller
            name="birthday"
            control={control}
            render={({ field }) => (
              <DatePickerComponent
                {...field}
                label="Birthday (optional)"
                disableFuture
                sx={{ width: '100%', mt: 2, mb: 1 }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.birthday,
                    helperText: errors.birthday?.message,
                  },
                }}
              />
            )}
          />
        </LocalizationProvider>

        <Controller
          name="hideUtorid"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={field.value} />}
              label="Hide UTORid from other users"
              sx={{ mt: 1, mb: 2 }}
            />
          )}
        />

        {(user.role === "regular" || user.role === "cashier") && 
          <Controller
            name="suspicious"
            control={control}
            defaultValue={user.suspicious}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    {...field}
                    checked={!!field.value}
                    size="large"
                  />
                }
                label="Flag as suspicious"
              />
            )}
          />
        }

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="outlined" onClick={onClose} disabled={editUserMutation.isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={editUserMutation.isPending || !isValid}
          >
            {editUserMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>
    </FormCard>
  );
}

export default EditUserForm;
