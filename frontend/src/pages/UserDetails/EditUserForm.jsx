import { useState } from 'react';
import {
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  Typography,
  Stack
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormCard from '../../components/common/FormCard';
import { roleOptions, userSchema } from './constants';

function EditUserForm({ user, onClose, onSubmit }) {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: {
      name: user?.name || '',
      utorid: user?.utorid || '',
      email: user?.email || '',
      role: user?.role || 'regular',
      birthday: user?.birthday || '',
      hideUtorid: user?.hideUtorid || false,
    },
    mode: 'onBlur',
  });

  const onSubmitHandler = async (data) => {
    setLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard onClose={onClose}>
      <Typography variant="h5" component="h2" gutterBottom>
        Edit User
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} sx={{ mt: 2 }}>
        <Stack direction={'row'} spacing={2}>
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
            name="utorid"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="UTorID"
                error={Boolean(errors.utorid)}
                helperText={errors.utorid?.message}
                margin="normal"
              />
            )}
          />
        </Stack>

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
              label="Hide UTorID from other users"
              sx={{ mt: 1, mb: 2 }}
            />
          )}
        />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="outlined" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !isValid}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>
    </FormCard>
  );
}

export default EditUserForm;
