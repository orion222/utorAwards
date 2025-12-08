import { Typography, Tabs, Tab, Box, Chip, Stack } from "@mui/material";
import { Container } from "@mui/system";
import QRCode from "./QRCode.jsx";
import RedeemPoints from "./RedeemPoints.jsx";
import TransferPoints from "./TransferPoints.jsx";
import useMediaQuery from "../../components/common/hooks/useMediaQuery.js";
import { useState } from "react";
import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext.jsx";
export default function Wallet() {
  const { shortenTab } = useMediaQuery();
  const location = useLocation();
  const { user } = useUser();

  if (location.pathname === "/wallet") {
    return <Navigate to="my-qr-code" />;
  }

  return (
    <>
      <Stack direction='row' gap={4}>
        <Typography variant="h4">My Wallet</Typography>
        <Chip
          label={`${user.points} PTS`}
          variant="filled"
          sx={{
            backgroundColor: "#2e7d32",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.1rem",
            padding: "0.5rem 1rem",
            borderRadius: "20px",
            boxShadow: "0 2px 8px rgba(46, 125, 50, 0.3)",
            "& .MuiChip-label": {
              fontSize: "1.1rem",
              fontWeight: "600"
            }
          }}
        />
      </Stack>
      <Tabs value={location.pathname}>
        <Tab label={shortenTab ? "QR Code" : "MY QR CODE"} value="/wallet/my-qr-code" component={Link} to="/wallet/my-qr-code" />
        <Tab label={shortenTab ? "Transfer" : "Transfer points"} value="/wallet/transfer" component={Link} to="/wallet/transfer" />
        <Tab label={shortenTab ? "Redeem" : "Redeem points"} value="/wallet/redeem" component={Link} to="/wallet/redeem" />
      </Tabs>
      <Box sx={{ p: 2 }}>
        <Outlet />
      </Box>
    </>
  );
}
