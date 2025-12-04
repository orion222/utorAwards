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
import { useToast } from "../../context/ToastContext.jsx";

function ManageEventUsers() {
  const { showToast } = useToast();
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
  }, [eventId, navigate, user.id, user.role]);

  // Clear changes when eventId changes
  useEffect(() => {
    setPointChanges({});
    setOriginalPoints({});
  }, [eventId]);

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
  const [pointChanges, setPointChanges] = useState({});
  const [originalPoints, setOriginalPoints] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const handlePointChange = (utorid, userId, newPoints, originalValue) => {
    if (!(utorid in originalPoints)) {
      setOriginalPoints(prev => ({
        ...prev,
        [utorid]: originalValue
      }));
    }

    const numericNewPoints = parseInt(newPoints) || 0;
    const numericOriginalPoints = originalPoints[utorid] || originalValue;

    if (numericNewPoints === numericOriginalPoints) {
      setPointChanges(prev => {
        const updated = { ...prev };
        delete updated[utorid];
        return updated;
      });
    } else {
      setPointChanges(prev => ({
        ...prev,
        [utorid]: {
          userId: userId,
          newPoints: numericNewPoints,
          originalPoints: numericOriginalPoints,
          changeAmount: numericNewPoints - numericOriginalPoints
        }
      }));
    }
  };

  const handleSaveChanges = async (refetchFn) => {
    const changeCount = Object.keys(pointChanges).length;
    if (changeCount === 0) {
      showToast("No changes to save", "info");
      return;
    }

    setIsSaving(true);

    try {
      // Submit all changes in parallel
      const updatePromises = Object.entries(pointChanges).map(([utorid, change]) =>
        api.post(`/events/${eventId}/transactions`, {
          type: 'event',
          amount: change.changeAmount,
          utorid: utorid,
        })
      );

      await Promise.all(updatePromises);
      showToast(`Successfully updated points for ${changeCount} guest${changeCount > 1 ? 's' : ''}`, "success");

      setPointChanges({});
      setOriginalPoints({});
      if (refetchFn) {
        refetchFn();
      }

    } catch (error) {
      console.error("Error saving point changes:", error);
      showToast("Failed to save some changes. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelChanges = () => {
    setPointChanges({});
    setOriginalPoints({});
    showToast("Changes cancelled", "info");
  };
  const handleAwardAll = (awardAmount) => {
    // Create changes for all users
    if (event.guests === undefined || event.guests.length === 0) {
      return;
    }
    const newPointChanges = {};
    const newOriginalPoints = {};

    event?.guests?.forEach(obj => {
      const user = obj.user;
      const newPoints = user.points + awardAmount;

      // Store original points if not already stored
      if (!(user.utorid in originalPoints)) {
        newOriginalPoints[user.utorid] = user.points;
      }

      // Create point change entry
      newPointChanges[user.utorid] = {
        userId: user.id,
        newPoints: newPoints,
        originalPoints: originalPoints[user.utorid] || user.points,
        changeAmount: awardAmount
      };
    });

    // Update state
    setOriginalPoints(prev => ({ ...prev, ...newOriginalPoints }));
    setPointChanges(prev => ({ ...prev, ...newPointChanges }));

    showToast(`Awarded ${awardAmount} points to ${event.numGuests} guests`, "info");
  };

  return (
    <Box sx={{ p: 2 }}>
      {event ? (
        <FilterableList
          queryKey={`all-users-for-event-${eventId}`}
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
                    pointChanges={pointChanges}
                    onPointChange={handlePointChange}
                    onSaveChanges={() => handleSaveChanges(refetch)}
                    onCancelChanges={handleCancelChanges}
                    onAwardAll={handleAwardAll}
                    numGuests = {event.numGuests}
                    isSaving={isSaving}
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
