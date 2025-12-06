import {
  Stack,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { passwordSchema } from "./constant";
import api from "../../../api/api";
import { useToast } from "../../../context/ToastContext";
import PasswordField from "../../common/PasswordField";

export default function ChangePassword({onClose}) {
	const { showToast } = useToast();
  const { control, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm({
		resolver: yupResolver(passwordSchema),
		mode: "onChange",
		defaultValues: {
		currentPassword: "",
		newPassword: "",
		confirmNewPassword: "",
		},
	});

  	const onSubmit = async (data) => {
        try {
			await api.patch("/users/me/password", {
				old: data.currentPassword,
				new: data.newPassword,
			});
			showToast("Password updated successfully!", "success");
			reset();
            onClose();
        } 
		catch (error) {
            const status = error.response?.status;
            const message = error.response?.data?.error || "Failed to update password";
            if (status === 403) {
                setError("currentPassword", { type: "manual", message: "Current password is incorrect" });
            } 
            else {
                showToast(message, "error");
            }
        }
  	};

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
            <Typography variant="h6">Change Password</Typography>
            <Controller
                name="currentPassword"
                control={control}
                render={({ field }) => (
                    <PasswordField
                        label="Current Password"
                        id="current-password"
                        value={field.value}
                        register={{
                            onChange: field.onChange,
                            onBlur: field.onBlur,
                            name: field.name,
                            ref: field.ref,
                        }}
                        error={errors.currentPassword?.message}
                    />
                )}
            />

            <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                    <PasswordField
                        label="New Password"
                        id="new-password"
                        value={field.value}
                        register={{
                            onChange: field.onChange,
                            onBlur: field.onBlur,
                            name: field.name,
                            ref: field.ref,
                        }}
                        error={errors.newPassword?.message}
                    />
                )}
            />
            <Controller
                name="confirmNewPassword"
                control={control}
                render={({ field }) => (
                    <PasswordField
                        label="Confirm New Password"
                        id="confirm-new-password"
                        value={field.value}
                        register={{
                            onChange: field.onChange,
                            onBlur: field.onBlur,
                            name: field.name,
                            ref: field.ref,
                        }}
                        error={errors.confirmNewPassword?.message}
                    />
                )}
            />
			
            <Stack direction="row" spacing={1} sx={{ alignSelf: "flex-end" }}>
				<Button
                    onClick={() => reset()}
                    disabled={isSubmitting}
                >
                    Reset Changes
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Updating..." : "Update Password"}
                </Button>
            </Stack>
        </Stack>
    </form>
  );
}