import {
  Box,
  Typography,
  useMediaQuery,
  Stack,
  Card,
  CardContent
} from "@mui/material";
import theme from "../../theme.js";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import { useNavigate } from "react-router-dom";
import EventStatusChip from "../../pages/Events/EventStatusChip.jsx";

function EventCard({
  event,
  detailsPage = true,
}) {
  const isSmall = useMediaQuery("(max-width: 670px)");
  const {
    name,
    description,
    location,
    startTime,
    endTime,
    capacity,
    numGuests,
    points,
  } = event;

  const navigate = useNavigate();


  const formatDate = (isoDate) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(new Date(isoDate));
  };

  function truncateStr(str) {
    let truncated = str;
    if (isSmall && str?.length > 20) {
      truncated = str.substring(0, 20) + "...";
    } else if (!isSmall && str?.length > 100) {
      truncated = str.substring(0, 100) + "...";
    }
    return truncated;
  }

  const handleViewDetails = () => {
    if (!detailsPage) return;
    navigate(`/events/${event.id}`, { state: { event } });
  };

  return (
    <Card
      sx={{
        p: 2,
        pb: 0,
        borderRadius: 2,
        border: `1px solid ${theme.palette.custom.border}`,
        bgcolor: theme.palette.background.paper,
        "&:hover": detailsPage ? { cursor: "pointer", boxShadow: 4 } : {},
        containerType: "inline-size",
        containerName: "eventCard",

        display: "flex",
        flexDirection: "column",
      }}
      onClick={handleViewDetails}
    >
      <CardContent sx={{ p: 0, display: "flex", flex: 1 }}>
        <Stack
          sx={{
            gap: 2,
            width: "100%",

            /* MOBILE */
            "@container eventCard (max-width: 300px)": {
              flexDirection: "column",
              alignItems: "stretch",
            },

            /* DESKTOP */
            "@container eventCard (min-width: 301px)": {
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "stretch",   // important: lets children stretch vertically
            },

            // ensure the Stack fills CardContent vertically
            height: "100%",
          }}
        >
          {/* ---------------- LEFT CONTENT ---------------- */}
          <Stack
            sx={{
              flex: 1,
              minWidth: 0,
              gap: 1,

              // ensures it fills the Stack height on desktop
              alignSelf: "stretch",
              height: "100%",
            }}
          >
            {/* NAME */}
            <Typography sx={{ fontSize: 20, fontWeight: "bold" }}>
              {name}
            </Typography>

            {/* POINTS — mobile only */}
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: "bold",

                "@container eventCard (max-width: 300px)": {
                  display: "block",
                },
                "@container eventCard (min-width: 301px)": {
                  display: "none",
                },
              }}
            >
              ({points} pts)
            </Typography>

            {/* DATE */}
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarTodayIcon
                sx={{ fontSize: 14, color: theme.palette.text.secondary }}
              />
              <Typography sx={{ fontSize: 11, color: theme.palette.text.secondary }}>
                {formatDate(startTime)} – {formatDate(endTime)}
              </Typography>
            </Stack>

            {/* LOCATION */}
            <Stack direction="row" spacing={1} alignItems="center">
              <LocationPinIcon
                sx={{ fontSize: 14, color: theme.palette.text.secondary }}
              />
              <Typography sx={{ fontSize: 11, color: theme.palette.text.secondary }}>
                {location}
              </Typography>
            </Stack>

            {/* DESCRIPTION */}
            <Typography
              sx={{
                fontSize: 11,
                maxWidth: 260,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",

                "@container eventCard (max-width: 300px)": {
                  WebkitLineClamp: 1,
                },
                "@container eventCard (min-width: 301px)": {
                  WebkitLineClamp: 3,
                },
              }}
            >
              {description}
            </Typography>

            {/* bottom area in left column — push to bottom on desktop */}
            <Box
              sx={{
                mt: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 1,
                width: "100%",
              }}
            >
              {/* STATUS CHIP */}
              <EventStatusChip
                startTime={startTime}
                endTime={endTime}
                published={event.published}
                sx={{
                  "@container eventCard (min-width: 301px)": { marginRight: 0 },
                }}
              />

              {/* CAP + CHIP on mobile (moved next to chip), hidden on desktop */
                /* On desktop capacity is shown on the right column; on mobile we show it here */}
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  marginLeft: "auto", // on mobile, this pushes capacity to the right beside chip
                  "@container eventCard (max-width: 300px)": {
                    display: "flex",
                  },
                  "@container eventCard (min-width: 301px)": {
                    display: "none",
                  },
                }}
              >
                <PeopleAltIcon sx={{ fontSize: 14, color: theme.palette.text.secondary }} />
                <Typography sx={{ fontSize: 11, color: theme.palette.text.secondary }}>
                  {capacity === null ? `${numGuests}` : `${numGuests}/${capacity}`}
                </Typography>
              </Stack>
            </Box>
          </Stack>

          {/* ---------------- RIGHT COLUMN DESKTOP ---------------- */}
          <Stack
            sx={{
              "@container eventCard (max-width: 300px)": {
                display: "none",
              },

              "@container eventCard (min-width: 301px)": {
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignSelf: "stretch",
                minWidth: "max-content",
                height: "100%",
              },
            }}
          >
            {/* POINTS */}
            <Typography sx={{ fontSize: 20, fontWeight: "bold" }}>
              {points} pts
            </Typography>

            {/* CAPACITY */}
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <PeopleAltIcon sx={{ fontSize: 14, color: theme.palette.text.secondary }} />
              <Typography sx={{ fontSize: 11, color: theme.palette.text.secondary }}>
                {capacity === null ? `${numGuests}` : `${numGuests}/${capacity}`}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default EventCard;
