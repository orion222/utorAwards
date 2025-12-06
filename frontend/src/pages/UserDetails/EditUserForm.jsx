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
  Switch
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormCard from '../../components/common/FormCard';
import { roleOptions, userSchema } from './constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../context/ToastContext';
import api from '../../api/api';

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
      birthday: user?.birthday || '',
      hideUtorid: user?.hideUtorid || false,
      suspicious: user?.suspicious || false
    },
    mode: 'onBlur',
  });

  const editUserMutation = useMutation({
    mutationFn: async (payload) => {
      console.log(payload);
      const res = await api.patch(`/users/${user.id}`, payload);
      console.log(res);
      return res.data;
    },
    onSuccess: () => {
      showToast("Update successful", "success");
      queryClient.invalidateQueries({ queryKey: ['user-details', String(user.id)] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onClose();
    },
    onError: (error) => {
      console.log(error);
      showToast(`Error: ${error.message || 'Failed to update user'}`, "error");
    }
  });

  const onSubmitHandler = async (data) => {
    const payload = {
      name: data.name === user?.name ? null : data.name,
      email: data.email === user?.email ? null : data.email,
      role: data.role === user?.role ? null : data.role,
      birthday: data.birthday === user?.birthday ? null : data.birthday,
      hideUtorid: data.hideUtorid === user?.hideUtorid ? null : data.hideUtorid,
      suspicious: data.suspicious === user?.suspicious ? null : data.suspicious
    };

    editUserMutation.mutate(payload);
  };

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
        <Controller
          name="birthday"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Birthday (optional)"
              placeholder="YYYY-MM-DD"
              error={Boolean(errors.birthday)}
              helperText={errors.birthday?.message}
              margin="normal"
            />
          )}
        />

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
