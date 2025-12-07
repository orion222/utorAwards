import {
  Avatar,
  Box,
  CircularProgress,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FilterableList from "../../components/common/FilterableList";
import { useUser } from "../../context/UserContext.jsx";

function Leaderboard() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const { user } = useUser();

  const filterConfig = {
    name: {
        type: "text",
        label: "Name",
    },
    verified: {
        type: "select",
        label: "Verified",
        options: ["True", "False"],
    }
  };

  if (user.role === "manager" || user.role === "superuser") {
    filterConfig.role = {
      type: "select",
      label: "Role",
      options: ["Regular", "Cashier", "Manager", "Superuser"],
    }
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>Leaderboard</Typography>

      <FilterableList queryKey="leaderboard" apiEndpoint="/users/leaderboard" filterConfig={filterConfig} limit={10}>
        {({ data, isFetching, error, hasFilters }) => {
          if (isFetching && !data) {
            return (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            );
          }

          if (error) {
            return (
              <Box display="flex" justifyContent="center" p={4}>
                <Typography variant="body1" color="error">
                  Something went wrong while fetching the leaderboard.
                </Typography>
              </Box>
            );
          }

          if (!data || data.length === 0) {
            return (
              <Typography variant="body2" color="textSecondary">
                No users found
              </Typography>
            );
          }

          if (!hasFilters) {
            const first = data.find(u => u.rank === 1);
            const second = data.find(u => u.rank === 2);
            const third = data.find(u => u.rank === 3);
            const rest = data.filter(u => u.rank > 3);

            return (
              <Box sx={{ opacity: isFetching ? 0.5 : 1, transition: "opacity 200ms ease-in-out" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    gap: { xs: 1, sm: 2 },
                    mb: { xs: 2, sm: 4 }
                  }}
                >
                  {/* 2nd */}
                  {second && (
                    <Box sx={{ textAlign: "center", width: { xs: 70, sm: 100 } }}>
                      <Avatar
                        sx={{
                          width: { xs: 40, sm: 60 },
                          height: { xs: 40, sm: 60 },
                          mx: "auto",
                          mb: 1,
                          bgcolor: "#C0C0C0"
                        }}
                        src={!second.hideUtorid && second.avatarUrl ? `${backendURL}/${second.avatarUrl}` : undefined}
                      >
                        {second?.utorid.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2">
                        {second?.utorid}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {second?.grossPoints} points
                      </Typography>
                      <Paper
                        sx={{
                          height: { xs: 50, sm: 80 },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "#C0C0C0",
                          mt: 1
                        }}
                      >
                        <Typography variant="h5">2</Typography>
                      </Paper>
                    </Box>                    
                  )}


                  {/* 1st */}
                  {first && (
                    <Box sx={{ textAlign: "center", width: { xs: 70, sm: 100 } }}>
                      <EmojiEventsIcon
                        sx={{
                          fontSize: { xs: 30, sm: 40 },
                          color: "#E6B800",
                          mb: 1
                        }}
                      />
                      <Avatar
                        sx={{
                          width: { xs: 50, sm: 80 },
                          height: { xs: 50, sm: 80 },
                          mx: "auto",
                          mb: 1,
                          bgcolor: "#E6B800"
                        }}
                        src={!first.hideUtorid && first.avatarUrl ? `${backendURL}/${first.avatarUrl}` : undefined}
                      >
                        {first?.utorid.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2">
                        {first?.utorid}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {first?.grossPoints} points
                      </Typography>
                      <Paper
                        sx={{
                          height: { xs: 80, sm: 120 },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "#E6B800",
                          mt: 1
                        }}
                      >
                        <Typography variant="h5">1</Typography>
                      </Paper>
                    </Box>
                  )}


                  {/* 3rd */}
                  {third && (
                    <Box sx={{ textAlign: "center", width: { xs: 70, sm: 100 } }}>
                      <Avatar
                        sx={{
                          width: { xs: 40, sm: 60 },
                          height: { xs: 40, sm: 60 },
                          mx: "auto",
                          mb: 1,
                          bgcolor: "#CD7F32"
                        }}
                        src={!third.hideUtorid && third.avatarUrl ? `${backendURL}/${third.avatarUrl}` : undefined}
                      >
                        {third?.utorid.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2">
                        {third?.utorid}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {third?.grossPoints} points
                      </Typography>
                      <Paper
                        sx={{
                          height: { xs: 40, sm: 60 },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "#CD7F32",
                          mt: 1
                        }}
                      >
                        <Typography variant="h5">3</Typography>
                      </Paper>
                    </Box>
                  )}
                </Box>

                <List>
                  {rest.map((user, i) => (
                    <ListItem
                      key={user.id}
                      sx={{
                        bgcolor: "background.paper",
                        mb: 1,
                        borderRadius: 1
                      }}
                    >
                      <Typography
                        sx={{
                          minWidth: 40,
                          fontWeight: "bold"
                        }}
                      >
                        {user.rank}
                      </Typography>

                      <ListItemAvatar>
                        <Avatar src={!user.hideUtorid && user.avatarUrl ? `${backendURL}/${user.avatarUrl}` : undefined} alt="Profile Picture">
                          {user.utorid.charAt(0).toUpperCase()}
                        </Avatar> 
                      </ListItemAvatar>

                      <ListItemText
                        primary={user.utorid}
                        secondary={`${user.grossPoints} points`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            );
          }

          return (
            <Box sx={{ opacity: isFetching ? 0.5 : 1, transition: "opacity 200ms ease-in-out" }}>
              <List>
              {data.map((user, index) => (
                <ListItem
                  key={user.id}
                  sx={{
                    bgcolor: "background.paper",
                    mb: 1,
                    borderRadius: 1
                  }}
                >
                  <Typography
                    sx={{
                      minWidth: 40,
                      fontWeight: "bold"
                    }}
                  >
                    {user.rank}
                  </Typography>

                  <ListItemAvatar>
                    <Avatar src={!user.hideUtorid && user.avatarUrl ? `${backendURL}/${user.avatarUrl}` : undefined}>
                      {user.utorid.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={user.utorid}
                    secondary={`${user.grossPoints} points`}
                  />
                </ListItem>
              ))}
              </List>
            </Box>
          );
        }}
      </FilterableList>
    </>
  );
}

export default Leaderboard;