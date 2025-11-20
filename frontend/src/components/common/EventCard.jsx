import { useTheme, useMediaQuery } from "@mui/material";
import { Box, Card, CardContent } from "@mui/material";
import theme from '../../theme.js';

function EventCard({ children }) {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Box
            sx={{
               border: 1,
               borderColor: theme.palette.custom.border,
               backgroundColor: theme.palette.background.paper,
               display: "flex",
               flexDirection: "row",
               justifyContent: "space-between",
               p: "16px",
               borderRadius: "8px",
               gap: "16px",
               width: "375px",
               height: "175px"
            }}
        >
           {children}
        </Box>
    );
}

export default EventCard;