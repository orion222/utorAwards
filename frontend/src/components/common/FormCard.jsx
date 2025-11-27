import { useTheme, useMediaQuery } from "@mui/material";
import { Box, Card, CardContent, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
function FormCard({
  width,
  contentPadding,
  showClose = false,
  onClose,
  fullWidth = false,
  children,
}) {
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
        p: fullWidth ? 0 : 2,
        height: "100%",
        width: "100%",
      }}
    >
      {isSmall ? (
        <Box sx={{ width: "100%", p: padding }}>{children}</Box>
      ) : (
        <Card
          sx={{
            width: fullWidth ? "100%" : cardWidth,
            p: padding,
            maxWidth: fullWidth ? "none" : cardWidth,
            boxSizing: "border-box",
          }}
        >
          {showClose && (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                onClick={onClose}
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
