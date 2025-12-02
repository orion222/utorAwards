import { useParams, useLocation } from "react-router-dom";
import EventCard from "../../components/common/EventCard.jsx";
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  useTheme,
  Stack,
  Chip,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/api";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationPinIcon from "@mui/icons-material/LocationPin";

function EventDetails() {
  const { eventId } = useParams();
  const { state } = useLocation();
  const theme = useTheme();

  const { data, isFetching, error } = useQuery({
    queryKey: ["event-details", eventId],
    queryFn: async () => {
      const response = await api.get(`/events/${eventId}`);
      return response.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  const formatDate = (dateIsoString) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(new Date(dateIsoString));
  };

  if (isFetching) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50%",
        }}
      >
        <Alert severity="error">
          An error occurred while fetching promotion details. Server error
        </Alert>
      </Box>
    );
  }

  //       const {
  //     id,
  //     name,
  //     description,
  //     location,
  //     startTime,
  //     endTime,
  //     capacity,
  //     numGuests,
  //     points,
  //   } = event;

  return (
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
      <Stack direction="row">
        {new Date(data.startTime) < new Date() && (
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
        )}
      </Stack>
      <Typography variant="h6" fontWeight="bold">
        Description
      </Typography>
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {data.description}
        </Typography>
      </Box>
      <EventCard
        event={state.event}
        key={eventId}
        detailsPage={false}
      ></EventCard>
    </Box>
  );
}

export default EventDetails;
