import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Stack,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Typography
} from '@mui/material';
import FormCard from '../../components/common/FormCard.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/api.js';

const roleOptions = [
  { value: 'regular', label: 'Regular' },
  { value: 'cashier', label: 'Cashier' },
  { value: 'manager', label: 'Manager' },
  { value: 'superuser', label: 'Superuser' }
];

function PromoteUserForm({ user, onClose, onSuccess }) {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    defaultValues: {
      role: user?.role || 'regular'
    }
  });

  const selectedRole = watch('role');

  const updateUserRoleMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await api.patch(`/users/${user.id}`, payload);
      return response.data;
    },
    onSuccess: (data) => {
      showToast(`Successfully promoted ${user.name} to ${data.role}`, "success");
      queryClient.invalidateQueries({ queryKey: ['user-details', String(user.id)] });
      onSuccess?.(data);
      onClose();
    },
    onError: (error) => {
      console.error("Error promoting user:", error);
      const errorMessage = error.response?.data?.error || "Failed to promote user";
      showToast(errorMessage, "error");
    }
  });

  const onSubmit = async (data) => {
    if (data.role === user.role) {
      showToast("No changes made to user role", "info");
      onClose();
      return;
    }

    const payload = {
      role: data.role
    };

    updateUserRoleMutation.mutate(payload);
  };

  return (
    <FormCard showClose onClose={onClose} width={450}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Typography variant="h5" fontWeight="bold" textAlign="center">
            Promote User
          </Typography>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            Change the role for <strong>{user?.name}</strong> ({user?.role})
          </Typography>

          <FormControl fullWidth error={!!errors.role}>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              value={selectedRole}
              label="Role"
              {...register('role', { required: 'Role is required' })}
              onChange={(e) => setValue('role', e.target.value)}
              disabled={updateUserRoleMutation.isPending}
            >
              {roleOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {errors.role && (
              <FormHelperText>{errors.role.message}</FormHelperText>
            )}
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            disabled={updateUserRoleMutation.isPending}
          >
            {updateUserRoleMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </Stack>
      </form>
    </FormCard>
  );
}

export default PromoteUserForm;
