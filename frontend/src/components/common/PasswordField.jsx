import { useState } from "react";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  IconButton,
  InputAdornment,
  FormHelperText
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function PasswordField({ value, onChange, error, label = "Password", id = "password" }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <FormControl fullWidth margin="normal" variant="outlined" error={Boolean(error)}>
            <InputLabel htmlFor={id}>{label}</InputLabel>

            <OutlinedInput
                id={id}
                label={label}
                type={showPassword ? "text" : "password"}
                value={value}
                onChange={onChange}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            onClick={() => setShowPassword((prev) => !prev)}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
            />

            {error && <FormHelperText error>{error}</FormHelperText>}
        </FormControl>
    );
}

export default PasswordField;