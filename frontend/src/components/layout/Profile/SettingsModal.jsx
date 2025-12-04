import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import Permission from "./Permission";
import ChangePassword from "./ChangePassword";

export default function SettingsModal({ open, onClose }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
            <Stack spacing={4} sx={{ mt: 1 }}>
            <Permission onClose = {onClose}/>
            <Divider />
            <ChangePassword onClose = {onClose}/>
            </Stack>
        </DialogContent>
        <DialogActions sx={{ p: "0 24px 16px" }}>
            <Button onClick={onClose}>Close</Button>
        </DialogActions>
        </Dialog>
    );
}