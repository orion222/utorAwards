import { useSearchParams, Navigate, Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { resetPasswordSchema } from "./constants.js";

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

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token");
  const email = searchParams.get("email");

  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
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

      setSuccess("Password successfully reset.");
      reset();
    } catch (err) {
      setServerError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <Box height="100vh" sx={{ overflow: "hidden" }}>
      <FormCard>
        <Typography variant="h5" fontWeight={600} mb={1}>
          Reset your password
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Enter a new password for your account.
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
            register={{...register("password")}}
          />

          <PasswordField
            label="Confirm Password"
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