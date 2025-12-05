import { useState, useEffect } from "react";
import {
  Typography,
  Stack,
  Switch,
  Button,
} from "@mui/material";
import { useUser } from "../../../context/UserContext";
import api from "../../../api/api";
import { useToast } from "../../../context/ToastContext";

export default function Permission({onClose}) {
  const { user } = useUser();
  const { showToast } = useToast();
  const [isPublic, setIsPublic] = useState(!user?.hideUtorid);
  const [originalIsPublic, setOriginalIsPublic] = useState(!user?.hideUtorid);
  const [isSubmitting, setIsSubmitting] = useState(false);

	const hasChanged = isPublic !== originalIsPublic;

  useEffect(() => {
    const newIsPublic = !user?.hideUtorid;
    setIsPublic(newIsPublic);
    setOriginalIsPublic(newIsPublic);
  }, [user]);

  const handleToggle = (event) => {
    setIsPublic(event.target.checked);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const response = await api.patch("/users/me", { hideUtorid: !isPublic });
      showToast("Permission updated successfully!", "success");
			onClose();
    } 
		catch (error) {
      const message = error.response?.data?.error || "Failed to update permission";
      showToast(message, "error");
      setIsPublic(originalIsPublic);
    } 
		finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Leaderboard Permission</Typography>
      <Typography variant="body2" color="text.secondary">
        Do you consent UTORAwards to display your UTORid on the points leaderboard?
      </Typography>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography>No</Typography>
          <Switch checked={isPublic} onChange={handleToggle} disabled={isSubmitting} />
          <Typography>Yes</Typography>
        </Stack>
        {hasChanged && (
          <Button variant="contained" onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </Stack>
    </Stack>
  );
}