import { useTheme, useMediaQuery } from "@mui/material";
import { Box, Card, CardContent } from "@mui/material";

function FormCard({ width, contentPadding, children }) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const cardWidth = width || 420;
  const padding = contentPadding || 4;

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
        <Box sx={{ width: "100%", p: padding }}>{children}</Box>
      ) : (
        <Card sx={{ width: cardWidth, p: padding }}>
          <CardContent>{children}</CardContent>
        </Card>
      )}
    </Box>
  );
}

export default FormCard;
