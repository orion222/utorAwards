import { useTheme, useMediaQuery } from "@mui/material";
import { Box, Card, CardContent } from "@mui/material";

function FormCard({ children }) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      {isSmall ? (
        // Full screen on mobile
        <Box sx={{ width: "100%", p: 4 }}>{children}</Box>
      ) : (
        // Card on tablet + desktop
        <Card sx={{ width: 420, p: 4 }}>
          <CardContent>{children}</CardContent>
        </Card>
      )}
    </Box>
  );
}

export default FormCard;
