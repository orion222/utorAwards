import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { redeemSchema as schema } from "./constants.js";
import {
  Stack,
  Box,
  TextField,
  Button,
  TextareaAutosize,
  Snackbar,
  Alert,
} from "@mui/material";
import FormCard from "../../common/FormCard.jsx";
import api from "../../../api/api";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";

export default function RedeemPoints() {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      userid: "",
      amount: "",
      remarks: "",
    },
  });

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = (_, reason) => {
    if (reason === "clickaway") return;
    setToast((t) => ({ ...t, open: false }));
  };

  const onSubmit = async (data) => {
    const { userid, amount, remarks } = data;

    const payload = {
      type: "transfer",
      amount: Number(amount),
      remark: remarks || "",
    };

    try {
      const response = await api.post(`/users/${userid}/transactions`, payload);
      showToast("Redemption successful", "success");
      reset();
    } catch (error) {
      console.log(error);
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Transfer failed";
      showToast(msg, "error");
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
                name="userid"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Points to redeem"
                    variant="outlined"
                    error={!!errors.userid}
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
                disabled={isSubmitting}
              >
                {isSubmitting ? "Transferring..." : "Transfer"}
              </Button>
            </Stack>
          </form>
          <Snackbar
            open={toast.open}
            autoHideDuration={2500}
            onClose={closeToast}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            sx={{ mt: 8 }}
          >
            <Alert
              onClose={closeToast}
              severity={toast.severity}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {toast.message}
            </Alert>
          </Snackbar>
        </>
      }
    />
  );
}
