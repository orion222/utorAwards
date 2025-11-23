import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
} from "@mui/material";

export default function ConfirmDialog({open, title, description, confirmLabel = "Confirm", cancelLabel = "Cancel", onClose, onConfirm, loading = false}) {
    const handleClose = () => {
        if (loading) return;
        onClose();
    };

    const handleConfirm = () => {
        if (loading) return;
        onConfirm();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" closeAfterTransition={false}>
            <DialogTitle
                sx={{ fontFamily: "Inter, sans-serif", color: "#232715" }}
            >
                {title}
            </DialogTitle>

            {description && (
                <DialogContent>
                    {description}
                </DialogContent>
            )}

            <DialogActions sx={{ p: 2 }}>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    sx={{
                        borderColor: "#e8ebdf",
                        color: "#232715",
                        fontFamily: "Inter, sans-serif",
                        textTransform: "none",
                        "&:hover": { backgroundColor: "#e8ebdf" },
                    }}
                >
                    {cancelLabel}
                </Button>

                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    disabled={loading}
                    sx={{
                        backgroundColor: "#7cd93a",
                        textTransform: "none",
                        fontFamily: "Inter, sans-serif",
                        "&:hover": { backgroundColor: "#6bc02e" },
                    }}
                >
                    {loading ? "Processing..." : confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
