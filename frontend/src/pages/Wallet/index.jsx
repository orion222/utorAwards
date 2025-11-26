import { Typography, Tabs, Tab, Box } from "@mui/material";
import { Container } from "@mui/system";
import QRCode from "./QRCode.jsx";
import RedeemPoints from "./RedeemPoints.jsx";
import TransferPoints from "./TransferPoints.jsx";
import useMediaQuery from "../../components/common/hooks/useMediaQuery.js";
import { useState } from "react";
import { Outlet, Link, useLocation, Navigate } from "react-router-dom";

export default function Wallet() {
  const { shortenTab } = useMediaQuery();
  const location = useLocation();

  if (location.pathname === "/wallet") {
    return <Navigate to="my-qr-code" />;
  }

  return (
    <>
      <Typography variant="h4">My Wallet</Typography>
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
