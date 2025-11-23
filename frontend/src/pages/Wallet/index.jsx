import { Typography, Tabs, Tab, Box } from "@mui/material";
import { Container } from "@mui/system";
import QRCode from "./QRCode.jsx";
import RedeemPoints from "./RedeemPoints.jsx";
import TransferPoints from "./TransferPoints.jsx";
import useMediaQuery from "../../components/common/hooks/useMediaQuery.js";
import { useState } from "react";

export default function Wallet() {
  const [tab, setTab] = useState(0);
  const { shortenTab } = useMediaQuery();
  return (
    <>
      <Typography variant="h4">My Wallet</Typography>
      <Tabs value={tab} onChange={(e, value) => setTab(value)}>
        <Tab label={shortenTab ? "QR Code" : "MY QR CODE"} />
        <Tab label={shortenTab ? "Transfer" : "Transfer points"} />
        <Tab label={shortenTab ? "Redeem" : "Redeem points"} />
      </Tabs>
      <Box sx={{ p: 2, border: 1, borderColor: "divider", borderTop: 0 }}>
        {tab === 0 && <QRCode />}
        {tab === 1 && <TransferPoints />}
        {tab === 2 && <RedeemPoints />}
      </Box>
    </>
  );
}
