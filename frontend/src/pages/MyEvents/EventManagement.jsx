import FilterableList from "../../components/common/FilterableList.jsx";
import {
  Alert,
  AlertTitle,
  Box,
  CircularProgress,
  Typography,
  Modal,
  useMediaQuery,
} from "@mui/material";
import { useUser } from "../../context/UserContext.jsx";
import EventCard from "../../components/common/EventCard.jsx";
import { useState } from 'react';
import EditEventForm from '../../pages/Events/EditEventForm.jsx';
import CreateEventButton from '../../pages/Events/CreateEventButton.jsx';
import FormCard from "../../components/common/FormCard.jsx";

function EventManagement() {
  const isSmall = useMediaQuery('(max-width:450px)');
  const { user } = useUser();
  const [createEventModal, setCreateEventModal] = useState(false);
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
        queryKey={`my-managed-events-${user.id}`}
        apiEndpoint="/users/me/events/management"
        filterConfig={filterConfig}
        orderByConfig={orderByConfig}
      >
        {({ data, isFetching, error, refetch }) => {
          if (isFetching) {
            return (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            );
          }

          return (
            error ? (
              <Box display="flex" justifyContent="center" p={4}>
                <Alert severity="error">
                  <AlertTitle severity="error">Error</AlertTitle>
                  Something went wrong while fetching your events. Your filters may be invalid. Try again later.
                </Alert>
              </Box>
              ) : (
                <>
                  <CreateEventButton onClick = {() => setCreateEventModal(true)} />
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
                        <EventCard
                          event={event}
                          key={event.id}
                          editable={true}
                          refetch={refetch}
                        />
                      ))}
                    </Box>
                  )}
                  <Modal
                    open={createEventModal}
                    onClose={() => setCreateEventModal(false)}
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
                    <FormCard
                      title="Create Event"
                      showClose={true}
                      onClose = {() => {
                        setCreateEventModal(false);
                      }}
                      keepForm={true}
                      width={'600px'}
                      children = {
                        <EditEventForm onClose = {() => setCreateEventModal(false)} refetch={refetch} createMode = {true} hideManageUsers = {true}/>
                      }
                    />
                  </Modal>
                </>
              )
          );
        }}
      </FilterableList>
    </Box>
  );
}

export default EventManagement;
