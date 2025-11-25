import { Box, Typography } from "@mui/material";
export default function LabeledField({label, required, children}) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="body1">
                {label}
                {required && <span style={{ color: "red" }}> *</span>}
            </Typography>
            {children}
        </Box>
    );
}