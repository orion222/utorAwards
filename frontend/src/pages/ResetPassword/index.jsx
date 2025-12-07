import { useSearchParams, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema } from "./constants";
import api from "../../api/api";
import FormCard from "../../components/common/FormCard.jsx";
import PasswordField from "../../components/common/PasswordField.jsx";
import {
  Box,
  Button,
  Typography,
  Alert,
  Link as MUILink
} from "@mui/material";
import LandingBackground from "../../components/common/LandingBackground.jsx";

export default function ResetPassword() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resetToken = searchParams.get("token");
  const email = searchParams.get("email");
  const isCreatePassword = location.pathname === "/create-password";

  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema)
  });

  if (!resetToken || !email) {
    return <Navigate to="/login" />;
  }

  const onSubmit = async (values) => {
    setServerError("");
    setSuccess("");

    try {
      await api.post(`/auth/resets/${resetToken}`, {
        email,
        password: values.password
      });

      if (isCreatePassword) {
        setSuccess("Password created successfully! You will be redirected to login shortly.");
      } 
      else {
        setSuccess("Password successfully reset. You will be redirected to login shortly.");
      }

      reset();
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setServerError(err.response?.data?.error || err.response?.data || "Something went wrong.");
    }
  };

  const pageTitle = isCreatePassword ? "Create Your Password" : "Reset Your Password";
  const pageDescription = isCreatePassword
    ? "Welcome to UTORAwards! Please create a password for your new account."
    : "Enter a new password for your account.";
  const buttonText = isCreatePassword ? "Create Password" : "Reset Password";

  return (
    <LandingBackground>
      <Box sx={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 400, mx: 2 }}>
        <FormCard>
          <Typography variant="h5" fontWeight={600} mb={1}>
            {pageTitle}
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={3}>
            {pageDescription}
          </Typography>

          {serverError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {serverError}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <PasswordField
              label="New Password"
              id="password"
              error={errors.password?.message}
              register={{ ...register("password") }}
            />

            <PasswordField
              label="Confirm New Password"
              id="confirmPassword"
              error={errors.confirmPassword?.message}
              register={{...register("confirmPassword")}}
            />
  
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 2 }}
              disabled={isSubmitting || !!success}
            >
              {isSubmitting ? (isCreatePassword ? "Creating..." : "Resetting...") : buttonText}
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
    </LandingBackground>
  );
}