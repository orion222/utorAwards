import {
  useTheme,
  Box,
  Stack,
  Typography,
  Avatar,
  Card,
  CardContent,
  Modal,
  Chip
} from "@mui/material";
import { useState } from "react";
import UserDetail from "./UserDetail";
import { useNavigate } from "react-router-dom";
import VerifiedIcon from "@mui/icons-material/Verified";

export default function UserCard({ user, clickable = true }) {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const theme = useTheme();
  const [detailsModal, setDetailsModal] = useState(false);
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        bgcolor: theme.palette.background.paper,
        borderRadius: 2,
        border: `1px solid ${theme.palette.custom.border}`,
        p: 1,
        "&:hover": { cursor: clickable ? "pointer" : "default", boxShadow: clickable ? 4 : "none" },
      }}
      onClick={clickable ? () => navigate(`/users/${user.id}`) : undefined}
    >
      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Stack direction="row" gap={1.5}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: theme.palette.text.primary,
                }}
              >
                {user.name}
              </Typography>
              {user.verified && (
                <VerifiedIcon sx = {{color: '#1591EA'}} />
              )}
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                mb: 0.5,
              }}
            >
              {user.utorid}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                mb: 1,
              }}
            >
              {user.email}
            </Typography>

            <Stack spacing={2} justifyContent="center">
              <Typography
                variant="caption"
                sx={{ color: theme.palette.text.secondary }}
              >
                <strong style={{ color: theme.palette.text.primary }}>
                  Role:
                </strong>{" "}
                {user.role === "superuser"
                  ? "Superuser"
                  : user.role || "Regular"}
              </Typography>

              {user.suspicious && (
                <Chip
                  label="SUSPICIOUS"
                  color="error"
                  size="small"
                  sx={{ width: "max-content" }}
                />
              )}
            </Stack>
          </Box>

          <Stack alignItems="center" spacing={1}>
            <Avatar
              src={user.avatarUrl ? `${backendURL}/${user.avatarUrl}` : undefined}
              sx={{
                width: 100,
                height: 100,
                bgcolor: theme.palette.custom.border,
                fontSize: "2rem",
              }}
            >
              {user.avatarUrl
                ? ""
                : user.name
                  ? user.name.charAt(0).toUpperCase()
                  : "U"}
            </Avatar>

            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: theme.palette.text.secondary,
                textAlign: "center",
              }}
            >
              {`${user.points} pts`}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>

      <Modal
        open={detailsModal}
        onClose={() => setDetailsModal(false)}
        aria-labelledby="user-details-modal"
        aria-describedby="user-details-content"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1300,
        }}
      >
        <Box
          sx={{
            borderRadius: "8px",
            boxShadow: 3,
            width: "auto",
            height: "auto",
            backgroundColor: theme.palette.background.paper,
            display: "flex",
            flexDirection: "column",
            gap: "0px",
            outline: "none",
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <UserDetail user={user} onClose={() => setDetailsModal(false)} />
        </Box>
      </Modal>
    </Card>
  );
}
