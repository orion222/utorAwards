import { Typography, Box } from "@mui/material";
import { Container } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";

export default function CreatePurchase() {
  const theme = useTheme();
  return (
    <Container
      sx={{
        padding: 3,
        backgroundColor: theme.palette.background.main,
      }}
    >
      <Typography variant="h3">My Wallet</Typography>
      <Box>
        hello
      </Box>
    </Container>
  );
}