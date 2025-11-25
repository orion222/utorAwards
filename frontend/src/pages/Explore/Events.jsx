import FilterableList from "../../components/common/FilterableList.jsx";
import {Alert, AlertTitle, Box, CircularProgress, Typography} from "@mui/material";
import {useUser} from "../../context/UserContext.jsx";
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
      label: "Location"
    },
    started: {
      type: "select",
      label: "Has Started",
      options: ["True", "False"],
    },
    ended: {
      type: "select",
      label: "Has Ended",
      options: ["True", "False"],
    },
    showFull: {
      type: "select",
      label: "Is Full",
      options: ["True", "False"],
    },
  }

  if (user.role === "manager" || user.role === "superuser") {
    filterConfig.published = {
      type: "select",
      label: "Published",
      options: ["True", "False"],
    }
  }

  return (
    <Box sx={{ my: 2 }}>
      <FilterableList queryKey="events" apiEndpoint="/events" filterConfig={filterConfig}>
        {({ data, isFetching, error }) => {
          if (error) {
            return (
              <Box display="flex" justifyContent="center" p={4}>
                <Alert>
                  <AlertTitle>Error</AlertTitle>
                  Something went wrong while fetching your transactions. Try again later.
                </Alert>
              </Box>
            )
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
                  <Typography variant="body2" color="textSecondary">No results found</Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: "100%",
                    display: "grid",
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)',
                    },
                    gap: 1,
                  }}
                >
                  {data.map(event => (
                    <EventCard event={event} key={event.id} />
                  ))}
                </Box>
              )}
            </>
          )
        }}
      </FilterableList>
    </Box>
  );
}

export default Events;