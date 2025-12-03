import { useParams, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  LinearProgress,
  useTheme,
  Stack,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import DetailsTemplate from "../../components/common/DetailsTemplate.jsx";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { useUser } from "../../context/UserContext.jsx";

function EventDetails() {
  const theme = useTheme();
  const { user } = useUser();
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const formatDate = (dateIsoString) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(new Date(dateIsoString));
  };

  return (
    <DetailsTemplate queryKey="event-details" apiEndpoint="/events">
      {data => {
        const isManagerOrSuperuser = ["manager", "superuser"].includes(user.role);
        const isOrganizer = data.organizers.some(o => o.id === user.id);

        const hasEventEnded = new Date(data.endTime) < new Date();
        const isEventLive = new Date(data.startTime) <= new Date() && !hasEventEnded;

        const pointsProgress = (data.pointsAwarded / data.points) * 100;

        return (
          <Box sx={{ my: 3, display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h4" fontWeight="bold">
              {data.name} ({data.points} pts)
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: { xs: 1, sm: 3 },
                flexWrap: "wrap",
              }}
            >
              <Typography variant="subtitle1" color="text.secondary">
                Event ID: {data.id}
              </Typography>

              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <CalendarTodayIcon sx={{ color: theme.palette.text.secondary }} />
                <Typography variant="subtitle1" color="text.secondary">
                  {`${formatDate(data.startTime)} - ${formatDate(data.endTime)}`}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <LocationPinIcon sx={{ color: theme.palette.text.secondary }} />
                <Typography variant="subtitle1" color="text.secondary">
                  {data.location}
                </Typography>
              </Box>
            </Box>

            <Stack direction="row" gap={1} alignItems="center">
              {hasEventEnded ? (
                <Chip label="ENDED" size="medium" sx={{ fontWeight: 600, fontSize: "0.9rem" }} />
              ) : isEventLive ? (
                <Chip
                  label="LIVE"
                  size="medium"
                  sx={{
                    backgroundColor: "#ff4444",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                />
              ) : (
                <>
                  {isManagerOrSuperuser && (
                    <Button
                      startIcon={<FiEdit color="grey" />}
                      onClick={(e) => console.log("hi, i dont do anything")}
                      sx={{
                        fontSize: 12,
                        color: "grey",
                        borderRadius: "8px",
                        width: "fit-content",
                        "&:hover": { backgroundColor: theme.palette.action.hover },
                      }}
                    >
                      Edit
                    </Button>
                  )}

                  {!isOrganizer && (
                    <Button variant="contained" color="secondary">RSVP</Button>
                  )}
                </>
              )}
            </Stack>

            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Description
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "row", gap: "8px", alignItems: "center", mb: 1 }}>
                <PeopleAltIcon sx={{ fontSize: 14, color: theme.palette.text.secondary }} />
                <Typography variant="body2" color="text.secondary">
                  {data.capacity === null
                    ? `${data.numGuests}`
                    : `${data.numGuests}/${data.capacity}`}
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary">
                {data.description}
              </Typography>

              {(isManagerOrSuperuser || isOrganizer) && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 3 }}>
                  <LinearProgress
                    variant="determinate"
                    value={pointsProgress}
                    sx={{
                      width: "35%",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: theme.palette.custom.accent,
                      },
                      backgroundColor: theme.palette.custom.primaryNeutral,
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {data.pointsAwarded}/{data.points} points awarded
                  </Typography>
                </Box>
              )}
            </Box>
            
            <Divider />
            <Typography variant="h6" fontWeight="bold">Organizers</Typography>
            <List sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)" }, gap: 2 }}>
              {data.organizers.map((user, index) => (
                <ListItem
                  key={index}
                  sx={{
                    bgcolor: "background.paper",
                    mb: 1,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <ListItemAvatar><Avatar src={user.avatarUrl ? `${backendURL}/${user.avatarUrl}` : undefined} /></ListItemAvatar>
                  <ListItemText primary={user.name} secondary={user.utorid} />
                </ListItem>
              ))}
            </List>

            {(isOrganizer || isManagerOrSuperuser) && (
              <>
                <Divider />
                <Typography variant="h6" fontWeight="bold">Guest List</Typography>
                <List sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)" }, gap: 2 }}>
                  {data.guests.map((item, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        bgcolor: "background.paper",
                        mb: 1,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <ListItemAvatar><Avatar src={item.user.avatarUrl ? `${backendURL}/${item.user.avatarUrl}` : undefined} /></ListItemAvatar>
                      <ListItemText primary={item.user.name} secondary={item.user.utorid} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </Box>
        );
      }}
    </DetailsTemplate>
  );
}

export default EventDetails;
