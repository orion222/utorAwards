import { Typography, Tabs, Tab, Box } from "@mui/material";
import { Container } from "@mui/system";
import QRCode from "./QRCode";
import RedeemPoints from "./RedeemPoints";
import TransferPoints from "./TransferPoints";
import { useTheme } from "@mui/material/styles";

import { useState } from "react";
export default function Wallet() {
  const [tab, setTab] = useState(0);
  const theme = useTheme();
  return (
    <>
      <Typography variant="h4">My Wallet</Typography>
      <Tabs value={tab} onChange={(e, value) => setTab(value)}>
        <Tab label="MY QR CODE" />
        <Tab label="Transfer points" />
        <Tab label="Redeem points" />
      </Tabs>
      <Box sx={{ p: 2, border: 1, borderColor: "divider", borderTop: 0 }}>
        {tab === 0 && <QRCode />}
        {tab === 1 && <TransferPoints />}
        {tab === 2 && <RedeemPoints />}
      </Box>
    </>
  );
}
