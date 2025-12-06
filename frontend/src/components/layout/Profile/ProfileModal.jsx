import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Avatar,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import api from "../../../api/api";
import { profileSchema as schema } from "./constant";
import useToast from "../../common/hooks/useToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function ProfileModal({ user, open, onClose, showToast }) {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl ? `${backendURL}/${user.avatarUrl}` : null);
  const [avatarFile, setAvatarFile] = useState(null);
  const {showToast: modalShowToast, ToastComponent} = useToast();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ 
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      birthday: user?.birthday ? dayjs(user.birthday) : null,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        birthday: user.birthday ? dayjs(user.birthday) : null,
      });
      setAvatarPreview(user.avatarUrl ? `${backendURL}/${user.avatarUrl}` : null);
    }
  }, [user, reset]);

  const updateProfileMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await api.patch("/users/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      showToast("Profile updated successfully!", "success");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["user-details", String(user.id)] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      onClose();
    },
    onError: (error) => {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to update profile";

      modalShowToast(message, "error");
    },
  });

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);

    if (data.birthday) {
      const birthdayString = dayjs(data.birthday).format("YYYY-MM-DD");
      formData.append("birthday", birthdayString);
    }

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    updateProfileMutation.mutate(formData);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {ToastComponent}
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>My Profile</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={avatarPreview} sx={{ width: 80, height: 80 }} />
              <Button
                variant="contained"
                component="label"
                startIcon={<PhotoCamera />}
              >
                Upload Avatar
                <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
              </Button>
            </Stack>

            <Controller name="name" control={control} render={({ field }) => (
                <TextField {...field} label="Full Name" error={!!errors.name} helperText={errors.name?.message} />
              )}
            />

            <Controller name="email" control={control} render={({ field }) => (
                <TextField {...field} label="Email Address" type="email" error={!!errors.email} helperText={errors.email?.message} />
              )}
            />

            <Controller
              name="birthday"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="Birthday"
                  disableFuture
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
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: "0 24px 24px" }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={updateProfileMutation.isPending}>
            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
}
