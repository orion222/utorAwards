import { useState } from "react";
import { Navigate, useSearchParams, Link } from "react-router-dom";
import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    OutlinedInput,
    FormHelperText,
    Button,
    Alert,
    Link as MUILink
} from "@mui/material";
import api from "../../api/api";
import FormCard from "../../components/common/FormCard";
import PasswordField from "../../components/common/PasswordField";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const resetToken = searchParams.get("token");
    const email = searchParams.get("email");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    if (!resetToken || !email) {
        return <Navigate to="/login" />;
    }

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!password.trim() || !confirmPassword.trim()) {
            if (!password.trim()) {
                setPasswordError("Enter your new password");
            }
            if (!confirmPassword.trim()) {
                setConfirmPasswordError("Confirm your new password");
            }
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            await api.post(`/auth/resets/${resetToken}`, {
                email,
                password
            });

            setSuccess("Password successfully reset.");
            setPassword("");
            setConfirmPassword("");
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong.");
        }
    };

    return (
        <Box height="100vh">
            <FormCard>
                <Typography variant="h5" fontWeight={600} mb={1}>
                    Reset your password
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Enter a new password for your account.
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleResetPassword}>
                    <PasswordField value={password} onChange={(e) => {setPassword(e.target.value); setPasswordError("");}} error={passwordError} label={"New Password"} id="newPassword" />
                    <PasswordField value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value); setConfirmPasswordError("");}} error={confirmPasswordError} label={"Confirm Password"} id="confirmPassword" />
                        
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{ mt: 2 }}
                    >
                        Reset Password
                    </Button>

                    <Box sx={{ textAlign: "center", mt: 2 }}>
                        <MUILink
                            component={Link}
                            to="/login"
                            underline="hover"
                            sx={{
                                color: "text.secondary",
                                fontSize: "0.85rem",
                                fontWeight: 500
                            }}
                        >
                            Back to login
                        </MUILink>
                    </Box>
                </Box>
            </FormCard>
        </Box>
    );
}

export default ResetPassword;