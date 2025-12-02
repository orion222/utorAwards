import { useParams, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  LinearProgress,
  useTheme,
  Stack,
  Chip,
  Button,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import DetailsTemplate from "../../components/common/DetailsTemplate.jsx";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { useUser } from "../../context/UserContext.jsx";

function EventDetails() {
  const theme = useTheme();
  const { user } = useUser();

  const formatDate = (dateIsoString) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(new Date(dateIsoString));
  };

  return (
    <DetailsTemplate queryKey="event-details" apiEndpoint="/events">
      {data => (
        <Box sx={{ my: 3, display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography variant="h4" fontWeight="bold">
            {data.name}
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
            {new Date(data.endTime) < new Date() ? (
              <Chip
                label="ENDED"
                size="medium"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              />
            ) : new Date(data.startTime) <= new Date() ? (
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
                {["manager", "superuser"].includes(user.role) && (
                  <Button
                    startIcon={<FiEdit color="grey" />}
                    onClick={(e) => {
                      console.log("hi, i dont do anything")
                    }}
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
                {!data.organizers.some(organizer => organizer.id === user.id) && (
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
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "8px",
                alignItems: "center",
                mb: 1
              }}
            >
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
            {(["manager", "superuser"].includes(user.role) || data.organizers.some(organizer => organizer.id === user.id)) && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 3 }}>
                <LinearProgress
                  variant="determinate"
                  value={(data.pointsAwarded / data.points) * 100}
                  sx={{ 
                    width: "35%", 
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: theme.palette.custom.accent,
                    },  
                    backgroundColor: theme.palette.custom.primaryNeutral
                   }}
                />

                <Typography variant="body2" color="text.secondary">
                  {data.pointsAwarded}/{data.points} points awarded
                </Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ textAlign: "center", mt: 1 }}>
              <Typography
                  variant="h3"
                  fontWeight="bold"
                  sx={{ color: "primary" }}
              >
                {data.points} pts
              </Typography>
          </Box>
        </Box>        
      )}
    </DetailsTemplate>

  );
}

export default EventDetails;
