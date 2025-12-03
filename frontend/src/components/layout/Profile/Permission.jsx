import { useState } from "react";
import {
  Typography,
  Stack,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useUser } from "../../../context/UserContext";
import api from "../../../api/api";

export default function Permission() {

  const { user } = useUser();
  const [isPublic, setIsPublic] = useState(!user?.hideUtorid);
  console.log("User permission:", user?.hideUtorid);

  const handleToggle = async (event) => {
    const newIsPublic = event.target.checked;
    setIsPublic(newIsPublic);

    try {
      await api.patch('/users/me', { hideUtorid: !newIsPublic });
    } catch (error) {
      const message = error.response?.data?.error || "Failed to update permission";
      setIsPublic(!newIsPublic);
    }
  };

  return (
    <Stack spacing={1}>
      <Typography variant="h6">Leaderboard Permission</Typography>
      <Typography variant="body2" color="text.secondary">
        Do you consent UTORAwards to display your UTORid on the points leaderboard?
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography>No</Typography>
        <Switch checked={isPublic} onChange={handleToggle} />
        <Typography>Yes</Typography>
      </Stack>
    </Stack>
  );
}