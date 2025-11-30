import React from "react";
import {
  Box,
  Typography,
  Alert,
  AlertTitle,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterableList from "../../components/common/FilterableList.jsx";
import EventUsersTable from "./EventUsersTable.jsx";
// Mock data (can be removed when API is integrated)
const mockData = [
  {
    id: 18,
    utorid: "ochen0222",
    name: "ochen",
    email: "ochenner@gmail.com",
    verified: false,
    points: 100,
  },
  {
    id: 19,
    utorid: "jerm69",
    name: "jerm",
    email: "jerm@yopmail.com",
    verified: false,
    points: 100,
  },
  {
    id: 20,
    utorid: "kobe67",
    name: "kobe",
    email: "yellowmamba@proton.me",
    verified: false,
    points: 100,
  },
  {
    id: 21,
    utorid: "brady01",
    name: "brady",
    email: "brad@hotmail.com",
    verified: false,
    points: 100,
  },
];

function ManageEventUsers({eventId, onClose, refetch}) {
  console.log("eventId is", eventId);
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
        Event Users
      </Typography>
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

          const displayData = data && data.length > 0 ? data : mockData;
          return (
            <>
              {displayData.length === 0 ? (
                <Box display="flex" justifyContent="center" p={4}>
                  <Typography variant="body2" color="textSecondary">
                    No users found
                  </Typography>
                </Box>
              ) : (
                <EventUsersTable data={displayData} />
              )}
            </>
          );
        }}
      </FilterableList>
    </Box>
  );
}

export default ManageEventUsers;
