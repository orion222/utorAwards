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
import FormCard from "../../components/common/FormCard.jsx";
import api from "../../api/api.js";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import useToast from "../../components/common/hooks/useToast.jsx";
import useQRCode from "../../components/common/hooks/useQRcode.jsx";
import VerifiedIcon from "@mui/icons-material/Verified";
import PendingIcon from "@mui/icons-material/Pending";
import convertToMDY from "../../components/common/helpers/convertToMDY.js";
import { useWallet } from "../../context/WalletContext.jsx";

export default function RedeemPoints() {
  const { showToast, ToastComponent } = useToast();
  const { redemptionData, setRedemption } = useWallet();
  const status = Boolean(redemptionData?.processedBy);
  console.log(redemptionData);
  const { canvasRef, isGenerating } = useQRCode(redemptionData);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      points: "",
      remarks: "",
    },
  });
  const hasGeneratedQR = Boolean(redemptionData);
  const onSubmit = async (data) => {
    try {
      if (hasGeneratedQR) {
        await submitCancelRedemption(redemptionData?.id);
      } else {
        await submitCreateRedemption(data);
      }
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Redemption failed";
      showToast(msg, "error");
    }
  };

  const submitCreateRedemption = async (data) => {
    const { points, remarks } = data;
    const payload = {
      type: "redemption",
      amount: Number(points),
      remark: remarks || "",
    };
    const response = await api.post(`/users/me/transactions`, payload);
    setRedemption(response.data);
    showToast("Created redemption!", "success");
  };
  const submitCancelRedemption = async (id) => {
    const payload = {
      id,
    };
    const res = await api.delete(`/users/me/transactions`, {
      data: payload,
    });
    if (res.status === 201) {
      showToast("Redemption cancelled!", "info");
      setRedemption(null);
      reset();
    } else {
      showToast("Cancellation failed", "error");
    }
  };

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
                    disabled={hasGeneratedQR}
                    value={redemptionData?.amount || field.value}
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
                    disabled={hasGeneratedQR}
                    value={redemptionData?.remark || field.value}
                  />
                )}
              />
              {hasGeneratedQR ? (
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 2 }}
                  disabled={isSubmitting || isGenerating}
                  color="error"
                >
                  {isSubmitting ? "Cancelling..." : "Cancel Redemption"}
                </Button>
              ) : (
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
              )}
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
