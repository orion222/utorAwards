import { Link } from 'react-router-dom';
import './style.css';

import { useState } from 'react';
import api from '../../api/api';
import FormCard from '../../components/common/FormCard';
import { Typography, Box, FormControl, InputLabel, OutlinedInput, FormHelperText, Button, Alert, Link as MUILink, CircularProgress } from "@mui/material";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [forgotPasswordError, setForgotPasswordError] = useState("");
    const [sentRequest, setSentRequest] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setForgotPasswordError("");
        setSentRequest(false);

        if (!email.trim()) {
            setEmailError("Enter your email");
            return;
        }

        if (!email.endsWith("@mail.utoronto.ca")) {
            setEmailError("Invalid email format");
            return;
        }

        try {
            setLoading(true);
            await api.post("/auth/resets", {
                email
            });
        } catch (error) {
            console.warn(error.response?.data || error.message);
            setForgotPasswordError("Too many requests. Try again in 1min");
        }

        setEmail("");
        setLoading(false);
        setSentRequest(true);
    }

    return (
        <FormCard>
            <Typography variant="h5" fontWeight={600} mb={1}>
                Forgot password?
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
                Enter the email used for your account and we'll send you a link to reset your password.
            </Typography> 

            {loading && (
                <Box 
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <CircularProgress />
                </Box>

            )}

            {sentRequest && !forgotPasswordError && (
                <Alert severity="info">Check your inbox! If an account exists for this email, we've sent a password reset link.</Alert>
            )}

            {forgotPasswordError && (
                <Alert severity="error">{forgotPasswordError}</Alert>
            )}
            
            <Box component="form" onSubmit={handleForgotPassword}>
                <FormControl fullWidth margin="normal" variant="outlined" error={Boolean(emailError)}>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <OutlinedInput
                        id="email"
                        label="Email"       
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError("");
                        }}
                    />
                    {emailError && (
                        <FormHelperText error>{emailError}</FormHelperText>
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
                            fontWeight: 500,
                        }}
                    >
                        Back to login
                    </MUILink>
                </Box>
            </Box>
        </FormCard>
    );  
}

export default ForgotPassword;