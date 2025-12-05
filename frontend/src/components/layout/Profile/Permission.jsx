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
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function Permission({onClose}) {
  const { user } = useUser();
  const { showToast } = useToast();
  const [isPublic, setIsPublic] = useState(!user?.hideUtorid);
  const [originalIsPublic, setOriginalIsPublic] = useState(!user?.hideUtorid);
  const queryClient = useQueryClient();

	const hasChanged = isPublic !== originalIsPublic;

  useEffect(() => {
    const newIsPublic = !user?.hideUtorid;
    setIsPublic(newIsPublic);
    setOriginalIsPublic(newIsPublic);
  }, [user]);

  const handleToggle = (event) => {
    setIsPublic(event.target.checked);
  };

  const updatePermissionMutation = useMutation({
    mutationFn: async (newValue) => {
      const payload = { hideUtorid: !newValue }; 
      const res = await api.patch("/users/me", payload);
      return res.data;
    },
    retry: false,
    onSuccess: () => {
      showToast("Permission updated successfully!", "success");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      onClose();
    },
    onError: (error) => {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to update permission";

      showToast(message, "error");
      setIsPublic(originalIsPublic);
    }
  });

  const handleSave = () => {
    updatePermissionMutation.mutate(isPublic);
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
          <Switch checked={isPublic} onChange={handleToggle} disabled={updatePermissionMutation.isPending} />
          <Typography>Yes</Typography>
        </Stack>
        {hasChanged && (
          <Button variant="contained" onClick={handleSave} disabled={updatePermissionMutation.isPending}>
            {updatePermissionMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </Stack>
    </Stack>
  );
}