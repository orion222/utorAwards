import {
  useTheme,
  Box,
  Stack,
  Typography,
  Avatar,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import VerifiedIcon from "@mui/icons-material/Verified";
import StatusChip from './StatusChip.jsx';

export default function UserCard({ user, clickable = true }) {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        bgcolor: theme.palette.background.paper,
        borderRadius: 2,
        border: `1px solid ${theme.palette.custom.border}`,
        p: 1,
        "&:hover": {
          cursor: clickable ? "pointer" : "default",
          boxShadow: clickable ? 4 : "none",
        },
        // Enable container queries
        containerType: "inline-size",
        containerName: "userCard",
      }}
      onClick={clickable ? () => navigate(`/users/${user.id}`) : undefined}
    >
      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Stack
          gap={1.5}
          sx={{
            display: "flex",
            /* Parent width ≤ 500px → mobile layout */
            "@container userCard (max-width: 300px)": {
              flexDirection: "column",
              alignItems: "center",
            },
            /* Parent width ≥ 501px → desktop layout */
            "@container userCard (min-width: 301px)": {
              flexDirection: "row",
              alignItems: "flex-start",
            },
          }}
        >
          {/* === RIGHT COLUMN (Avatar + Points) === */}
          <Stack
            alignItems="center"
            spacing={1}
            sx={{
              flexShrink: 0,
              minWidth: 140,
              "@container userCard (max-width: 300px)": {
                order: 1,             // Avatar first on mobile
                width: "100%",
              },
              "@container userCard (min-width: 301px)": {
                order: 2,             // Avatar second on desktop
                width: "auto",
              },
            }}
          >
            <Avatar
              src={user.avatarUrl ? `${backendURL}/${user.avatarUrl}` : undefined}
              sx={{
                width: { xs: 80, sm: 110 },
                height: { xs: 80, sm: 110 },
                bgcolor: theme.palette.custom.border,
                fontSize: { xs: "1.75rem", sm: "2rem" },
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

          {/* === LEFT COLUMN (Text Info) === */}
          <Box
            sx={{
              flex: 1,
              flexShrink: 1,
              minWidth: 0,
              width: "100%",

              "@container userCard (max-width: 300px)": {
                order: 2,          // Text after avatar on mobile
              },

              "@container userCard (min-width: 301px)": {
                order: 1,          // Text first on desktop
              },
            }}
          >
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: theme.palette.text.primary,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100%",
                }}
              >
                {user.name}
              </Typography>

              {user.verified && <VerifiedIcon sx={{ color: "#1591EA" }} />}
            </Box>

            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5, whiteSpace: "normal", overflowWrap: "anywhere", }}>
              {user.utorid}
            </Typography>

            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 1, whiteSpace: "normal", overflowWrap: "anywhere", }}>
              {user.email}
            </Typography>

            <Stack spacing={2} justifyContent="center">
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                <strong style={{ color: theme.palette.text.primary }}>Role:</strong>{" "}
                {user.role === "superuser" ? "Superuser" : user.role || "Regular"}
              </Typography>

              {user.suspicious && (
                <StatusChip
                  label="SUSPICIOUS"
                  color="error"
                  size="small"
                  sx={{ width: "max-content" }}
                />
              )}
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
