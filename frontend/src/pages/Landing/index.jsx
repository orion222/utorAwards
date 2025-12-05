import { Box, Button, Typography, Stack, Paper } from "@mui/material";
import { Trophy } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

function Landing() {
  const { user } = useUser();

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
      }}
    >
      <Stack spacing={4} textAlign="center" maxWidth={600}>
        <Paper
          elevation={0}
          sx={{
            width: 100,
            height: 100,
            mx: "auto",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "custom.bgDark",
            border: "2px solid",
            borderColor: "custom.border",
            alignSelf: "center",
          }}
        >
          <Trophy size={48} color="#7CD93A" strokeWidth={1.5} />
        </Paper>

        <Typography
          variant="h2"
          fontWeight={800}
          sx={{
            color: "primary.main",
            textShadow: "0px 2px 4px rgba(0,0,0,0.05)",
            letterSpacing: "-0.5px",
          }}
        >
          UTORAwards
        </Typography>

        <Typography variant="h6" sx={{ color: "text.secondary", lineHeight: 1.5 }}>
          Track your progress, earn loyalty points, and redeem rewards designed to celebrate student success.
        </Typography>

        <Button
          variant="contained"
          size="large"
          sx={{
            px: 4,
            bgcolor: "primary.main",
            "&:hover": { bgcolor: "primary.dark" },
            width: "max-content",
            alignSelf: "center",
          }}
          component={Link}
          to="/login"
        >
          Get Started
        </Button>
      </Stack>
    </Box>
  );
}

export default Landing; 