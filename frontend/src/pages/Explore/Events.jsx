import FilterableList from "../../components/common/FilterableList.jsx";
import {
  Alert,
  AlertTitle,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useUser } from "../../context/UserContext.jsx";
import EventCard from "../../components/common/EventCard.jsx";

function Events() {
  const { user } = useUser();

  const filterConfig = {
    name: {
      type: "text",
      label: "Name",
    },
    location: {
      type: "text",
      label: "Location",
    },
    started: {
      type: "select",
      label: "Has Started",
      options: ["True", "False"],
      exclusiveWith: ["ended"],
    },
    ended: {
      type: "select",
      label: "Has Ended",
      options: ["True", "False"],
      exclusiveWith: ["started"],
    },
    showFull: {
      type: "select",
      label: "Is Full",
      options: ["True", "False"],
    },
  };

  const orderByConfig = [
    { label: "Start Time (Earliest)", value: "startTime_asc" },
    { label: "Start Time (Latest)", value: "startTime_desc" },
    { label: "End Time (Earliest)", value: "endTime_asc" },
    { label: "End Time (Latest)", value: "endTime_desc" },
    { label: "Points (Lowest)", value: "points_asc" },
    { label: "Points (Highest)", value: "points_desc" },
    { label: "Number of Guests (Lowest)", value: "numGuests_asc" },
    { label: "Number of Guests (Highest)", value: "numGuests_desc" },
  ];

  if (user.role === "manager" || user.role === "superuser") {
    filterConfig.published = {
      type: "select",
      label: "Published",
      options: ["True", "False"],
    };
  }

  return (
    <Box sx={{ my: 2 }}>
      <FilterableList
        queryKey="events"
        apiEndpoint="/events"
        filterConfig={filterConfig}
        orderByConfig={orderByConfig}
      >
        {({ data, isFetching, error, refetch }) => {
          if (error) {
            return (
              <Box display="flex" justifyContent="center" p={4}>
                <Alert severity="error">
                  <AlertTitle severity="error">Error</AlertTitle>
                  Something went wrong while fetching your transactions. Your
                  filters may be invalid. Try again later.
                </Alert>
              </Box>
            );
          }

          if (isFetching) {
            return (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            );
          }

          return (
            <>
              {data.length === 0 ? (
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    No results found
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: "100%",
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                      md: "repeat(3, 1fr)",
                    },
                    gap: 2,
                  }}
                >
                  {data.map((event) => (
                    <EventCard refetch={refetch} event={event} key={event.id} />
                  ))}
                </Box>
              )}
            </>
          );
        }}
      </FilterableList>
    </Box>
  );
}

export default Events;
