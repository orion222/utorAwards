import { useState } from "react";
import {
  Typography,
  Stack,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useUser } from "../../../context/UserContext";
import api from "../../../api/api";

export default function Permission({ showToast }) {
  const { user } = useUser();
  const [isPublic, setIsPublic] = useState(user?.isPublic || true);

  const handleToggle = async (event) => {
    const newIsPublic = event.target.checked;
    setIsPublic(newIsPublic);

    // TODO: Uncomment when API endpoint is ready
    // try {
    //   const response = await api.patch('/users/me/permission', { isPublic: newIsPublic });
    //   setUser(response.data);
    //   showToast("Permission updated successfully!", "success");
    // } catch (error) {
    //   const message = error.response?.data?.error || "Failed to update permission";
    //   showToast(message, "error");
    //   // Revert state on failure
    //   setIsPublic(!newIsPublic);
    // }
  };

  return (
    <Stack spacing={1}>
      <Typography variant="h6">Leaderboard Permission</Typography>
      <Typography variant="body2" color="text.secondary">
        Do you consent utorAwards to display your name in record on the points leaderboard?
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography>No</Typography>
        <Switch checked={isPublic} onChange={handleToggle} />
        <Typography>Yes</Typography>
      </Stack>
    </Stack>
  );
}