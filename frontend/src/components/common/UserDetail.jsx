import {
  useTheme,
  Box,
  Stack,
  Button,
  Typography,
  Avatar,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function UserDetail({ user, onClose }) {
  const theme = useTheme();
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  console.log(onClose);
  return (
    <Card
      sx={{
        maxWidth: 450,
        bgcolor: theme.palette.background.paper,
        borderRadius: 2,
        border: `1px solid ${theme.palette.custom.border}`,
        p: 1.33,
        position: "relative",
      }}
    >
      {onClose && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            sx={{
              color: theme.palette.text.secondary,
              transform: "scale(0.8)",
            }}
          >
            <CloseIcon color="error" fontSize="medium" />
          </IconButton>
        </Box>
      )}

      <CardContent sx={{ p: 1.33, "&:last-child": { pb: 1.33 } }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: theme.palette.text.primary,
                mb: 0.67,
              }}
            >
              {user.name}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                mb: 0.67,
              }}
            >
              {user.utorid}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                mb: 1.33,
              }}
            >
              {user.email}
            </Typography>

            <Stack spacing={0.33} sx={{ mb: 2 }}>
              <Typography
                variant="caption"
                sx={{ color: theme.palette.text.secondary, fontSize: "0.8rem" }}
              >
                <strong style={{ color: theme.palette.text.primary }}>
                  Role:
                </strong>{" "}
                {user.role === "superuser" ? "Superuser" : user.role}
              </Typography>

              <Typography
                variant="caption"
                sx={{ color: theme.palette.text.secondary, fontSize: "0.8rem" }}
              >
                <strong style={{ color: theme.palette.text.primary }}>
                  Last Login:
                </strong>{" "}
                {formatDate(user.lastLogin)}
              </Typography>

              <Typography
                variant="caption"
                sx={{ color: theme.palette.text.secondary, fontSize: "0.8rem" }}
              >
                <strong style={{ color: theme.palette.text.primary }}>
                  Member Since:
                </strong>{" "}
                {formatDate(user.createdAt)}
              </Typography>

              <Typography
                variant="caption"
                sx={{ color: theme.palette.text.secondary, fontSize: "0.8rem" }}
              >
                <strong style={{ color: theme.palette.text.primary }}>
                  DOB:
                </strong>{" "}
                {formatDate(user.birthday)}
              </Typography>

              <Typography
                variant="caption"
                sx={{ color: theme.palette.text.secondary, fontSize: "0.8rem" }}
              >
                <strong style={{ color: theme.palette.text.primary }}>
                  Verified:
                </strong>{" "}
                {user.verified ? "Yes" : "No"}
              </Typography>

              <Typography
                variant="caption"
                sx={{ color: theme.palette.text.secondary, fontSize: "0.8rem" }}
              >
                <strong style={{ color: theme.palette.text.primary }}>
                  Suspicious:
                </strong>{" "}
                {user.suspicious ? "Yes" : "No"}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={0.67} flexWrap="wrap">
              <Button
                variant="contained"
                size="small"
                sx={{
                  bgcolor: theme.palette.secondary.main,
                  color: theme.palette.text.primary,
                  borderRadius: 1.33,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.7rem",
                  px: 1.33,
                  py: 0.5,
                  "&:hover": {
                    bgcolor: "#F08A4D",
                  },
                }}
              >
                Edit User
              </Button>

              <Button
                variant="contained"
                size="small"
                sx={{
                  bgcolor: theme.palette.secondary.main,
                  color: theme.palette.text.primary,
                  borderRadius: 1.33,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.7rem",
                  px: 1.33,
                  py: 0.5,
                  "&:hover": {
                    bgcolor: "#F08A4D",
                  },
                }}
              >
                Promote
              </Button>

              <Button
                variant="contained"
                size="small"
                sx={{
                  bgcolor: theme.palette.secondary.main,
                  color: theme.palette.text.primary,
                  borderRadius: 1.33,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.7rem",
                  px: 1.33,
                  py: 0.5,
                  "&:hover": {
                    bgcolor: "#F08A4D",
                  },
                }}
              >
                Transactions
              </Button>

              <Button
                variant="contained"
                size="small"
                sx={{
                  bgcolor: theme.palette.secondary.main,
                  color: theme.palette.text.primary,
                  borderRadius: 1.33,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.7rem",
                  px: 1.33,
                  py: 0.5,
                  "&:hover": {
                    bgcolor: "#F08A4D",
                  },
                }}
              >
                Events
              </Button>
            </Stack>
          </Box>

          <Stack alignItems="center" spacing={1.33}>
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

            <Button
              variant="contained"
              size="small"
              sx={{
                bgcolor: theme.palette.secondary.main,
                color: theme.palette.text.primary,
                borderRadius: 1.33,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.7rem",
                px: 1.33,
                py: 0.67,
                "&:hover": {
                  bgcolor: "#F08A4D",
                },
              }}
            >
              Change Photo
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
