import { useTheme, useMediaQuery } from "@mui/material";
import { Box, Card, CardContent, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
function FormCard({ width, contentPadding, showClose = false, children }) {
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
        height: "100%",
      }}
    >
      {isSmall ? (
        <Box sx={{ width: "100%", p: padding }}>{children}</Box>
      ) : (
        <Card sx={{ width: cardWidth, p: padding }}>
          {showClose && (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                startIcon={
                  <CloseIcon
                    sx={{
                      color: "red",
                    }}
                  />
                }
                sx={{
                  "&:hover": { backgroundColor: "#CBCBCB" },
                  color: theme.palette.text.secondary,
                }}
              >
                Close
              </Button>
            </Box>
          )}
          <CardContent>{children}</CardContent>
        </Card>
      )}
    </Box>
  );
}

export default FormCard;
