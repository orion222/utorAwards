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
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  FormLabel
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUser } from "../../context/UserContext";
import api from "../../api/api";
import { profileSchema as schema } from "./constant";

export default function ProfileModal({ showToast, open, onClose }) {
  const { user } = useUser();
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarURL);
  const [avatarFile, setAvatarFile] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ 
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      birthYear: user?.birthday ? parseInt(user.birthday.split('-')[0], 10) : "",
      birthMonth: user?.birthday ? parseInt(user.birthday.split('-')[1], 10) : "",
      birthDay: user?.birthday ? parseInt(user.birthday.split('-')[2], 10) : "",
    },
  });

  useEffect(() => {
    if (user) {
      const birthdayParts = user.birthday ? user.birthday.split('-') : null;
      reset({
        name: user.name || "",
        email: user.email || "",
        birthYear: birthdayParts ? parseInt(birthdayParts[0], 10) : "",
        birthMonth: birthdayParts ? parseInt(birthdayParts[1], 10) : "",
        birthDay: birthdayParts ? parseInt(birthdayParts[2], 10) : "",
      });
      setAvatarPreview(user.avatarURL);
    }
  }, [user, reset]);

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

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    const year = data.birthYear;
    const month = String(data.birthMonth).padStart(2, '0');
    const day = String(data.birthDay).padStart(2, '0');
    const birthdayPayload = `${year}-${month}-${day}`;
    formData.append("birthday", birthdayPayload);

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      const response = await api.patch(`/users/me`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      showToast("Profile updated successfully!", "success");
      onClose();
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to update profile";
      showToast(message, "error");
    }
  };

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
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

            <FormControl component="fieldset" variant="standard">
              <FormLabel component="legend" sx={{ mb: 1 }}>Birthday</FormLabel>
              <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth error={!!errors.birthYear}>
                  <InputLabel>Year</InputLabel>
                  <Controller name="birthYear" control={control} render={({ field }) => (
                      <Select {...field} label="Year">
                        {years.map((year) => (
                          <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.birthYear && <FormHelperText>{errors.birthYear.message}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth error={!!errors.birthMonth}>
                  <InputLabel>Month</InputLabel>
                  <Controller name="birthMonth" control={control} render={({ field }) => (
                      <Select {...field} label="Month">
                        {months.map((month) => (
                          <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                   {errors.birthMonth && <FormHelperText>{errors.birthMonth.message}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth error={!!errors.birthDay}>
                  <InputLabel>Day</InputLabel>
                  <Controller name="birthDay" control={control} render={({ field }) => (
                      <Select {...field} label="Day">
                        {days.map((day) => (
                          <MenuItem key={day} value={day}>{day}</MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.birthDay && <FormHelperText>{errors.birthDay.message}</FormHelperText>}
                </FormControl>
              </Grid>
            </Grid>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: "0 24px 16px" }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
