import { useUser } from "../../../context/UserContext";
import { Stack, Box, Button, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import QRCodeGenerator from "qrcode";
import FormCard from "../../common/FormCard.jsx";
import useToast from "../../common/hooks/useToast.jsx";
export default function QRCode() {
  const { user } = useUser();
  const canvasRef = useRef();
  const [qrCodeDataURL, setQrCodeDataURL] = useState("");
  const { showToast, ToastComponent } = useToast();

  const qrData = {
    userId: user?.id,
    name: user?.name,
    utorid: user?.utorid,
    email: user?.email,
    verified: user?.verified,
    role: user?.role,
    timestamp: new Date().toISOString(),
  };

  useEffect(() => {
    if (user && canvasRef.current) {
      generateQRCode();
    }
  }, [user]);

  const generateQRCode = async () => {
    try {
      const jsonString = JSON.stringify(qrData);

      await QRCodeGenerator.toCanvas(canvasRef.current, jsonString, {
        width: 256,
        margin: 2,
        color: {
          dark: "#232715",
          light: "#FCFEFB",
        },
      });

      const dataURL = await QRCodeGenerator.toDataURL(jsonString, {
        width: 256,
        margin: 2,
        color: {
          dark: "#232715",
          light: "#FCFEFB",
        },
      });
      setQrCodeDataURL(dataURL);
    } catch (error) {
      console.error("Error generating QR code:", error);
      showToast("Failed to generate QR code", "error");
    }
  };

  const handleDownloadQR = () => {
    if (qrCodeDataURL) {
      const link = document.createElement("a");
      link.download = `user-${user.id}-qrcode.png`;
      link.href = qrCodeDataURL;
      link.click();
      showToast("QR code downloaded successfully!", "info");
    } else {
      showToast("QR code not ready for download", "warning");
    }
  };

  const handleCopyQRData = async () => {
    try {
      const jsonString = JSON.stringify(qrData, null, 2);
      await navigator.clipboard.writeText(jsonString);
      showToast("QR data copied to clipboard!", "success");
    } catch (error) {
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
          >
            Copy QR Data
          </Button>
          <Button
            variant="contained"
            color="info"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadQR}
          >
            Download QR Code
          </Button>
        </Stack>

        {ToastComponent}
      </Stack>
    </FormCard>
  );
}
