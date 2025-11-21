import { useMemo } from "react";
import { useUser } from "../../../context/UserContext";
import { Stack, Box, Button, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import FormCard from "../../common/FormCard.jsx";
import useToast from "../../common/hooks/useToast.jsx";
import useQRCode from "../../common/hooks/useQRcode.jsx";
export default function QRCode() {
  const { user } = useUser();
  const { showToast, ToastComponent } = useToast();

  const qrData = useMemo(
    () => ({
      userId: user?.id,
      name: user?.name,
      utorid: user?.utorid,
      email: user?.email,
      verified: user?.verified,
      role: user?.role,
      timestamp: new Date().toISOString(),
    }),
    [
      user?.id,
      user?.name,
      user?.utorid,
      user?.email,
      user?.verified,
      user?.role,
    ],
  );

  const {
    canvasRef,
    qrCodeDataURL,
    isGenerating,
    QRerror,
    downloadQRCode,
    copyQRData,
  } = useQRCode(qrData);

  if (QRerror) {
    showToast("Failed to generate QR code", "error");
  }

  const handleDownloadQR = () => {
    const success = downloadQRCode(`user-${user?.id}-qrcode.png`);
    if (success) {
      showToast("QR code downloaded successfully!", "success");
    } else {
      showToast("QR code not ready for download", "warning");
    }
  };

  const handleCopyQRData = async () => {
    const success = await copyQRData();
    if (success) {
      showToast("QR data copied to clipboard!", "success");
    } else {
      showToast("Failed to copy QR data", "error");
    }
  };
  return (
    <FormCard>
      <Stack direction="column" alignItems="center" spacing={3}>
        <Typography variant="body1" textAlign="center">
          Show this to a cashier to earn or spend points
        </Typography>

        <Box
          sx={{
            border: "2px solid #D9DCCF",
            borderRadius: 2,
            p: 2,
            backgroundColor: "#FCFEFB",
          }}
        >
          <canvas ref={canvasRef} />
        </Box>

        {user && (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              User: <strong>{user.name}</strong>
            </Typography>
          </Box>
        )}

        <Stack direction="row" spacing={2} mt={2}>
          <Button
            variant="contained"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyQRData}
            disabled={isGenerating || !qrCodeDataURL}
          >
            Copy QR Data
          </Button>
          <Button
            variant="contained"
            color="info"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadQR}
            disabled={isGenerating || !qrCodeDataURL}
          >
            {isGenerating ? "Generating..." : "Download QR Code"}
          </Button>
        </Stack>

        {ToastComponent}
      </Stack>
    </FormCard>
  );
}
