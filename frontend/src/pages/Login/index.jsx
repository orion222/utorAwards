import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUser } from "../../context/UserContext";
import api from "../../api/api";
import { Link, useNavigate } from "react-router-dom";

import {
  Typography,
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Button,
  Alert,
  Link as MUILink
} from "@mui/material";

import FormCard from "../../components/common/FormCard";
import PasswordField from "../../components/common/PasswordField";
import { loginSchema } from "./constants.js";
import { useToast } from '../../context/ToastContext.jsx';
import LandingBackground from "../../components/common/LandingBackground.jsx";

function Login() {
  const { login } = useUser();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(loginSchema)
  });

  const onSubmit = async (values) => {
    setServerError("");

    try {
      const { data } = await api.post("/auth/tokens", {
        utorid: values.utorid,
        password: values.password
      });

      try {
        const csrfResponse = await api.get('/auth/csrf-token');
        api.defaults.headers.common['x-csrf-token'] = csrfResponse.data.token;
      } catch (csrfError) {
        console.warn('CSRF token fetch failed:', csrfError);
      }

      login();
      navigate("/dashboard");
      reset();
      showToast(`Logged in as ${values.utorid}`, 'success')
    } catch (error) {
      console.warn(error.response?.data || error.message);
      setServerError(
        error.response?.data?.error || "Something went wrong with your login"
      );
    }
  };

  return (
    <LandingBackground>
      {/* Main Content */}
      <Box sx={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 400, mx: 2 }}>
        <FormCard> 
          <Typography variant="h5" fontWeight={600} mb={1}>
            Let's pick up where you left off
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={3}>
            Sign in to view your points, rewards, and events.
          </Typography>

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
              error={Boolean(errors.utorid)}
            >
              <InputLabel htmlFor="utorid">UTORid</InputLabel>
              <OutlinedInput
                id="utorid"
                label="UTORid"
                {...register("utorid")}
              />
              {errors.utorid && (
                <FormHelperText error>{errors.utorid.message}</FormHelperText>
              )}
            </FormControl>

            <PasswordField
              id="password"
              label="Password"
              register={{...register("password")}}
              error={errors.password?.message}
            />

            <Box sx={{ textAlign: "right", mb: 2 }}>
              <MUILink
                component={Link}
                to="/forgot-password"
                underline="hover"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.85rem",
                  fontWeight: 500
                }}
              >
                Forgot your password?
              </MUILink>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </Box>
        </FormCard>
      </Box>
    </LandingBackground>
  );
}

export default Login;