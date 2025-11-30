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

function ManageEventUsers() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  useEffect(() => {
    async function fetchEvent() {
      try {
        const { data } = await api.get(`/events/${parseInt(eventId, 10)}`);
        setEvent(data);
      } catch (err) {
        console.error("Error fetching event:", err);
      }
    }
    fetchEvent();
  }, []);
  const filterConfig = {
    name: {
      type: "text",
      label: "Username",
    },
    email: {
      type: "text",
      label: "Email",
    },
    points: {
      type: "number",
      label: "Points",
      min: 0,
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

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Event users for {event ? event.name : `${eventId}`}
      </Typography>
      {event ? (
        <FilterableList
          queryKey="all-users"
          apiEndpoint="/users"
          filterConfig={filterConfig}
          orderByConfig={orderByConfig}
          limit={5}
        >
          {({ data, isFetching, error }) => {
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
                {data.length === 0 ? (
                  <Box display="flex" justifyContent="center" p={4}>
                    <Typography variant="body2" color="textSecondary">
                      No users found
                    </Typography>
                  </Box>
                ) : (
                  <EventUsersTable data={data} />
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
