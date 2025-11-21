import { Snackbar, Alert } from "@mui/material";
import { useState } from "react";

export default function useToast() {
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

  const ToastComponent = (
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
  );

  return { showToast, ToastComponent };
}
