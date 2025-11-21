import { useState } from "react";
import { useUser } from "../../context/UserContext";
import api from "../../api/api";
import { Link, useNavigate } from "react-router-dom";
import { Typography, Box, FormControl, InputLabel, OutlinedInput, FormHelperText, Button, Alert, Link as MUILink } from "@mui/material";

import './style.css';
import FormCard from "../../components/common/FormCard";
import PasswordField from "../../components/common/PasswordField";

function Login() {
    const { login } = useUser();
    const [utorid, setUtorid] = useState("");
    const [password, setPassword] = useState("");
    const [utoridError, setUtoridError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loginError, setLoginError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError("");

        if (!utorid.trim() || !password.trim()) {
            if (!utorid.trim()) 
                setUtoridError("Enter your UTORid");
            if (!password.trim()) 
                setPasswordError("Enter your password");
            return;
        }

        try {
            const { data: authData } = await api.post("/auth/tokens", {
                utorid,
                password,
            });

            const { data: userData } = await api.get("/users/me", {
                headers: {
                Authorization: `Bearer ${authData.token}`,
                },
            });

            login(authData.token, userData);
            navigate("/dashboard");
        } catch (error) {
            console.warn(error.response?.data || error.message);
            setLoginError(error.response?.data?.error || "Something went wrong with your login");
        }
    }

    return (
        <FormCard>
            <Typography variant="h5" fontWeight={600} mb={1}>
                Let's pick up where you left off
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
                Sign in to view your points, rewards, and events.
            </Typography>                
            
            {loginError && (
                <Alert severity="error" sx={{ mb: 2 }}>{loginError}</Alert>
            )}

            <Box component="form" onSubmit={handleLogin}>
                <FormControl fullWidth margin="normal" variant="outlined" error={Boolean(utoridError)}>
                    <InputLabel htmlFor="utorid">UTORid</InputLabel>
                    <OutlinedInput
                        id="utorid"
                        label="UTORid"       
                        value={utorid}
                        onChange={(e) => {
                            setUtorid(e.target.value);
                            setUtoridError("");
                        }}
                    />
                    {utoridError && (
                        <FormHelperText error>{utoridError}</FormHelperText>
                    )}
                </FormControl>
                
                <PasswordField value={password} onChange={(e) => {setPassword(e.target.value); setPasswordError("");}} error={passwordError} />

                <Box sx={{ textAlign: "right", mb: 2 }}>
                    <MUILink 
                        component={Link}
                        to="/forgot-password" 
                        underline="hover" 
                        sx={{
                            color: "text.secondary",
                            fontSize: "0.85rem",
                            fontWeight: 500,
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
    );
}

export default Login;
