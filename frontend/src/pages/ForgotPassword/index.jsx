import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import api from "../../api/api";
import FormCard from "../../components/common/FormCard";
import { forgotPasswordSchema } from "./constants.js";

import {
  Typography,
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Button,
  Alert,
  Link as MUILink,
  CircularProgress
} from "@mui/material";

function ForgotPassword() {
  const [serverError, setServerError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema)
  });

  const onSubmit = async (values) => {
    setServerError("");
    setSent(false);

    try {
      setLoading(true);
      await api.post("/auth/resets", { email: values.email });
      setSent(true);
      reset();
    } catch (error) {
      console.warn(error.response?.data || error.message);
      setServerError("Too many requests. Try again in 1 min.");
    }

    setLoading(false);
  };

  return (
    <Box height="100vh" sx={{ overflow: "hidden" }}>
      <FormCard>
        <Typography variant="h5" fontWeight={600} mb={1}>
          Forgot password?
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Enter the email used for your account and we'll send you a link to reset your password.
        </Typography>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {sent && !serverError && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Check your inbox! If an account exists for this email, we've sent a password reset link.
          </Alert>
        )}

        {serverError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {serverError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <FormControl
            fullWidth
            margin="normal"
            variant="outlined"
            error={Boolean(errors.email)}
          >
            <InputLabel htmlFor="email">Email</InputLabel>
            <OutlinedInput
              id="email"
              label="Email"
              {...register("email")}
            />
            {errors.email && (
              <FormHelperText error>
                {errors.email.message}
              </FormHelperText>
            )}
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ my: 2 }}
          >
            Reset
          </Button>

          <Box sx={{ textAlign: "center" }}>
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

export default ForgotPassword;