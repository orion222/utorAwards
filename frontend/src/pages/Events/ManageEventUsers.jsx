import React from "react";
import {
  Box,
  Typography,
  Alert,
  AlertTitle,
  CircularProgress,
} from "@mui/material";
import FilterableList from "../../components/common/FilterableList.jsx";
import EventUsersTable from "./EventUsersTable.jsx";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api.js";
import { useNavigate } from "react-router-dom";
import { useUser } from '../../context/UserContext.jsx'

function ManageEventUsers() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  useEffect(() => {
    async function fetchEvent() {
      try {
        const { data } = await api.get(`/events/${parseInt(eventId, 10)}`);

        const isManagerOrSuperuser = ['manager', 'superuser'].includes(user.role);
        const isOrganizerOfEvent = data.organizers?.some((org) => org.id === user.id);
        if (!isManagerOrSuperuser && !isOrganizerOfEvent) {
          console.error("Unauthorized access to event users management");
          navigate("/unauthorized");
          return;
        }
        setEvent(data);
      } catch (err) {
        console.error("Error fetching event:", err);
      }
    }
    fetchEvent();
  }, []);

  const filterConfig = {
    is_guest: {
      type: "boolean",
      label: "Guests",
      default: true,
    },
    is_organizer: {
      type: "boolean",
      label: "Organizers",
      default: false,
    },
  };

  const orderByConfig = [
    { label: "Username (A-Z)", value: "name_asc" },
    { label: "Username (Z-A)", value: "name_desc" },
    { label: "Email (A-Z)", value: "email_asc" },
    { label: "Email (Z-A)", value: "email_desc" },
    { label: "Points (Highest)", value: "points_desc" },
    { label: "Points (Lowest)", value: "points_asc" },
  ];
  const handleChangeQueriedUserType = (filters) => {
    if (filters.is_guest && !filters.is_organizer) {
      return "Guests";
    } else if (!filters.is_guest && filters.is_organizer) {
      return "Organizers";
    } else if (filters.is_guest && filters.is_organizer) {
      return "Guests and organizers";
    } else {
      return "Unenrolled users";
    }
  };
  return (
    <Box sx={{ p: 2 }}>
      {event ? (
        <FilterableList
          queryKey="all-users"
          apiEndpoint="/users"
          filterConfig={filterConfig}
          orderByConfig={orderByConfig}
          additionalParams={{ eventId: eventId }}
          limit={5}
          initialFilters={{ is_guest: true }}
        >
          {({ data, isFetching, error, getAppliedFilters, refetch }) => {
            const queriedUserType = handleChangeQueriedUserType(
              getAppliedFilters()
            );
            if (error) {
              return (
                <Box display="flex" justifyContent="center" p={4}>
                  <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    Something went wrong while fetching users. Showing mock data
                    instead.
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
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                  {queriedUserType} for {event ? event.name : `${eventId}`}
                </Typography>
                {data.length === 0 ? (
                  <Box display="flex" justifyContent="center" p={4}>
                    <Typography variant="body2" color="textSecondary">
                      No {queriedUserType} found
                    </Typography>
                  </Box>
                ) : (
                  <EventUsersTable
                    setQueriedUserType={handleChangeQueriedUserType}
                    refetch={refetch}
                    eventId={event.id}
                    data={data}
                    filters={getAppliedFilters()}
                  />
                )}
              </>
            );
          }}
        </FilterableList>
      ) : (
        <Typography>Event not found</Typography>
      )}
    </Box>
  );
}

export default ManageEventUsers;
