import {
  useTheme,
  Box,
  Stack,
  Button,
  Typography,
  Avatar,
  Card,
  CardContent,
  Modal,
} from "@mui/material";
import { useState } from "react";
import UserDetail from "./UserDetail";

export default function UserCard() {
  const theme = useTheme();
  const [detailsModal, setDetailsModal] = useState(false);

  const user = {
    id: 1,
    utorid: "clive123",
    name: "clive123",
    email: "clive.su@mail.utoronto.ca",
    birthday: null,
    role: "superuser",
    points: 89,
    createdAt: "2025-11-18T03:10:22.963Z",
    lastLogin: "2025-11-27T22:24:33.170Z",
    verified: true,
    avatarUrl: null,
    promotions: [],
    isEventOrganizer: true,
    organizedEvents: [],
  };
  return (
    <Card
      sx={{
        maxWidth: 400,
        bgcolor: theme.palette.background.paper,
        borderRadius: 2,
        border: `1px solid ${theme.palette.custom.border}`,
        p: 1,
      }}
    >
      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: theme.palette.text.primary,
                mb: 0.5,
              }}
            >
              {user.name}
            </Typography>

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

            <Stack spacing={0.25} sx={{ mb: 1.5 }}>
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

              <Typography
                variant="caption"
                sx={{ color: theme.palette.text.secondary }}
              >
                <strong style={{ color: theme.palette.text.primary }}>
                  Verified:
                </strong>{" "}
                {user.verified ? "Yes" : "No"}
              </Typography>

              <Typography
                variant="caption"
                sx={{ color: theme.palette.text.secondary }}
              >
                <strong style={{ color: theme.palette.text.primary }}>
                  Suspicious:
                </strong>{" "}
                No
              </Typography>
            </Stack>

            <Button
              variant="contained"
              size="small"
              onClick={() => setDetailsModal(true)}
              sx={{
                bgcolor: theme.palette.secondary.main,
                color: theme.palette.text.primary,
                borderRadius: 1,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.75rem",
                px: 1.5,
                py: 0.5,
                "&:hover": {
                  bgcolor: "#F08A4D",
                },
              }}
            >
              View Details
            </Button>
          </Box>

          <Stack alignItems="center" spacing={1}>
            <Avatar
              src={user.avatarUrl}
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
              {user.points ? `${user.points} Pts` : "Points N/A"}
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
