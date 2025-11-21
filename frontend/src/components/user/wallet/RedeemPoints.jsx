import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { redeemSchema as schema } from "./constants.js";
import {
  Stack,
  Box,
  TextField,
  Button,
  TextareaAutosize,
  Chip,
} from "@mui/material";
import FormCard from "../../common/FormCard.jsx";
import api from "../../../api/api";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import useToast from "../../common/hooks/useToast.jsx";
import useQRCode from "../../common/hooks/useQRcode.jsx";
import VerifiedIcon from "@mui/icons-material/Verified";
import PendingIcon from "@mui/icons-material/Pending";

export default function RedeemPoints() {
  const { showToast, ToastComponent } = useToast();
  const [redemptionData, setRedemptionData] = useState(null);
  const [status, setStatus] = useState(false);
  const {
    canvasRef,
    qrCodeDataURL,
    isGenerating,
    QRerror: error,
    downloadQRCode,
    copyQRData,
  } = useQRCode(redemptionData);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      points: "",
      remarks: "",
    },
  });

  const onSubmit = async (data) => {
    const { points, remarks } = data;

    const payload = {
      type: "redemption",
      amount: Number(points),
      remark: remarks || "",
    };

    try {
      const response = await api.post(`/users/me/transactions`, payload);
      showToast("Redemption transaction created", "success");
      setRedemptionData(response.data);
      setStatus(response.data.processedBy !== null);
      console.log(response.data);
      showToast("Created redemption!", "success");
    } catch (error) {
      console.log(error);
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Redemption failed";
      showToast(msg, "error");
    }
  };

  function convertToMDY(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
  return (
    <FormCard
      children={
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Box
                component="h2"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                Redeem Points <CardGiftcardIcon />
              </Box>

              <Controller
                name="points"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Points to redeem"
                    variant="outlined"
                    error={!!errors.points}
                    helperText={errors.points?.message}
                  />
                )}
              />

              <Controller
                name="remarks"
                control={control}
                render={({ field }) => (
                  <TextareaAutosize
                    {...field}
                    minRows={3}
                    placeholder="Remarks (optional)"
                    style={{
                      padding: 12,
                      fontFamily: "inherit",
                      fontSize: "1rem",
                      borderRadius: 4,
                      border: errors.remarks
                        ? "1px solid #d32f2f"
                        : "1px solid #ccc",
                    }}
                  />
                )}
              />

              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2 }}
                disabled={isSubmitting || isGenerating}
              >
                {isSubmitting || isGenerating
                  ? "Generating..."
                  : "Generate QR Code"}
              </Button>
              {redemptionData && (
                <Stack spacing={2} mt={4} alignItems="center">
                  <Box
                    sx={{
                      border: "2px solid #D9DCCF",
                      borderRadius: 2,
                      p: 2,
                      backgroundColor: "#FCFEFB",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <canvas ref={canvasRef} />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                    }}
                  >
                    {status ? (
                      <Chip
                        icon={<VerifiedIcon />}
                        label="PROCESSED"
                        color="success"
                        sx={{ color: "white" }}
                      />
                    ) : (
                      <Chip
                        icon={<PendingIcon />}
                        label="PENDING"
                        color="info"
                        sx={{ color: "white" }}
                      />
                    )}
                    Created at {convertToMDY(redemptionData.createdAt)}
                  </Box>
                </Stack>
              )}
            </Stack>
          </form>
          {ToastComponent}
        </>
      }
    />
  );
}
