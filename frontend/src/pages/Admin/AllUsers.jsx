import {Alert, AlertTitle, Box, CircularProgress, Typography} from "@mui/material";
import FilterableList from "../../components/common/FilterableList.jsx";
import UserCard from "../../components/common/UserCard.jsx";

function AllUsers() {
  const filterConfig = {
    name: {
        type: "text",
        label: "Name",
    },
    role: {
        type: "select",
        label: "Role",
        options: ["Regular", "Cashier", "Manager", "Superuser"],
    },
    verified: {
        type: "select",
        label: "Verified",
        options: ["True", "False"],
    },
    activated: {
        type: "select",
        label: "Activated",
        options: ["True", "False"],
    },
    suspicious: {
        type: "select",
        label: "Suspicious",
        options: ["True", "False"],
    },
  };

  const orderByConfig = [
    { label: "Name (A-Z)", value: "name_asc" },
    { label: "Name (Z-A)", value: "name_desc" },
    { label: "Points (Highest)", value: "points_desc" },
    { label: "Points (Lowest)", value: "points_asc" },
    { label: "Created At (Newest)", value: "createdAt_desc" },
    { label: "Created At (Oldest)", value: "createdAt_asc" },
    { label: "Role (A-Z)", value: "role_asc" },
    { label: "Role (Z-A)", value: "role_desc" },
  ];

  return (
    <>
      <Box sx={{ my: 2 }}>
        <FilterableList queryKey="all-users" apiEndpoint="/users" filterConfig={filterConfig} orderByConfig={orderByConfig}>
          {({ data, isFetching, error }) => {
            if (error) {
              return (
                <Box display="flex" justifyContent="center" p={4}>
                  <Alert severity="error">
                    <AlertTitle severity="error">Error</AlertTitle>
                    Something went wrong while fetching your transactions. Your filters may be invalid. Try again later.
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
                    <Typography variant="body2" color="textSecondary">No users found</Typography>
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
                    {data.map((user) => (
                      <UserCard key={user.id} user={user} />
                    ))}
                  </Box>
                )}
              </>
            )
          }}
        </FilterableList>
      </Box>
    </>
  );
}

export default AllUsers;