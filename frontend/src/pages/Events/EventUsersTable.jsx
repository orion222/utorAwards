import {
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import TableActions from "./TableActions.jsx";
import { useEffect } from "react";

export default function UsersTable({
  setQueriedUserType,
  filters,
  refetch,
  eventId,
  data,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  // Badge colors that rotate
  const badgeColors = {
    guest: { bg: "#e8f5e8", text: "#2e7d32", border: "#4caf50" }, // Green
    organizer: { bg: "#e3f2fd", text: "#1565c0", border: "#42a5f5" }, // Blue,
    other: { bg: "#ffebee", text: "#c62828", border: "#f44336" }, // Red
  };

  const getBadgeColor = (role) => {
    return badgeColors[role];
  };

  const cellSx = {
    fontWeight: 600,
    fontSize: "0.875rem",
    color: theme.palette.text.primary,
    ...(isMobile && { padding: "16px 8px" }),
  };

  const bodyCellSx = {
    fontSize: "0.875rem",
    ...(isMobile && { padding: "16px 8px" }),
  };
  useEffect(() => {
    setQueriedUserType(filters);
  }, []);
  return (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: "none",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        maxWidth: "100%",
      }}
    >
      <Table sx={{ width: "100%", minWidth: isMobile ? 0 : 400 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
            <TableCell sx={cellSx}>ID</TableCell>
            <TableCell sx={cellSx}>UTORID</TableCell>
            {!isMobile && (
              <>
                <TableCell sx={cellSx}>NAME</TableCell>
                <TableCell sx={cellSx}>EMAIL</TableCell>
                <TableCell sx={cellSx}>POINTS</TableCell>
              </>
            )}
            <TableCell sx={cellSx}>ACTION</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((user) => {
            const badgeColor = getBadgeColor(user.event_role);
            return (
              <TableRow
                key={user.id}
                sx={{
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <TableCell sx={bodyCellSx}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 32,
                      height: 24,
                      borderRadius: "4px",
                      backgroundColor: badgeColor.bg,
                      border: `1px solid ${badgeColor.border}`,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: badgeColor.text,
                    }}
                  >
                    #{user.id}
                  </Box>
                </TableCell>
                <TableCell sx={bodyCellSx}>{user.utorid}</TableCell>
                {!isMobile && (
                  <>
                    <TableCell sx={bodyCellSx}>{user.name}</TableCell>
                    <TableCell sx={bodyCellSx}>{user.email}</TableCell>
                    <TableCell sx={bodyCellSx}>
                      <Chip
                        label={user.points}
                        size="small"
                        sx={{
                          backgroundColor: theme.palette.grey[300],
                          color: theme.palette.text.primary,
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                  </>
                )}
                <TableCell sx={bodyCellSx}>
                  <TableActions
                    refetch={refetch}
                    eventId={eventId}
                    utorid={user.utorid}
                    userId={user.id}
                    is_guest={user.event_role === "guest"}
                    is_organizer={user.event_role === "organizer"}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
