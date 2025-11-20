// ...existing code...
import { useState } from "react";
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

export default function TransferPoints() {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = (_, reason) => {
    if (reason === "clickaway") return;
    setToast((t) => ({ ...t, open: false }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const userId = Number(formData.get("userid")); // numeric recipient id
    const amount = Number(formData.get("amount"));
    const remark = formData.get("remarks") || "";

    if (!Number.isInteger(userId) || userId <= 0) {
      showToast("Invalid recipient user ID", "error");
      return;
    }
    if (!Number.isInteger(amount) || amount <= 0) {
      showToast("Amount must be a positive integer", "error");
      return;
    }

    const payload = {
      type: "transfer",
      amount,
      remark,
    };

    try {
      const response = await api.post(`/users/${userId}/transactions`, payload);
      showToast("Transfer successful", "success");
      // Optionally clear amount/remarks fields here by resetting the form if desired.
    } catch (error) {
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
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <Box component="h2">Send Points</Box>
              <TextField
                name="userid"
                label="Recipient User ID"
                variant="outlined"
                type="number"
                required
                inputProps={{ min: 1 }}
              />
              <TextField
                name="amount"
                label="Amount"
                type="number"
                variant="outlined"
                required
                inputProps={{ min: 1 }}
              />
              <TextareaAutosize
                name="remarks"
                minRows={3}
                placeholder="Remarks (optional)"
                style={{
                  padding: 12,
                  fontFamily: "inherit",
                  borderRadius: 4,
                  border: "1px solid #ccc",
                }}
              />
              <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                Transfer
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
