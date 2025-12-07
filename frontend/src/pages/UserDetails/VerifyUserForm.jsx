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

function VerifyUserForm({ user, onClose, onSuccess }) {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const verifyUserMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await api.patch(`/users/${user.id}`, payload);
      return response.data;
    },
    onSuccess: (data) => {
      showToast(`Successfully Verified ${user.name}`, "success");
      queryClient.invalidateQueries({ queryKey: ['user-details', String(user.id)] });
      onSuccess?.(data);
      onClose();
    },
    onError: (error) => {
      console.error("Error verifying user:", error);
      const errorMessage = error.response?.data?.error || "Failed to verify user";
      showToast(errorMessage, "error");
    }
  });

  const onSubmit = async () => {

    const payload = {
      verified: true
    };

    verifyUserMutation.mutate(payload);
  };

  return (
    <FormCard showClose onClose={onClose} width={450}>
      <form onSubmit={onSubmit}>
        <Stack spacing={3}>
          <Typography variant="h5" fontWeight="bold" textAlign="center">
            Verify User
          </Typography>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            Verify <strong>{user?.name}</strong> ?
          </Typography>
          <Button
            type="submit"
            variant="contained"
            disabled={verifyUserMutation.isPending}
          >
            {verifyUserMutation.isPending ? "Confirming..." : "Confirm"}
          </Button>
        </Stack>
      </form>
    </FormCard>
  );
}

export default VerifyUserForm;
