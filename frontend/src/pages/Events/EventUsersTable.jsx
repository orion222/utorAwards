import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import TableActions from "./TableActions.jsx";
import SaveCancelButtons from "../../components/common/SaveCancelButtons.jsx";
import AwardAllButton from "../../components/common/AwardAllButton.jsx";
import {useMemo} from "react";
export default function UsersTable({
  refetch,
  eventId,
  data,
  pointChanges = {},
  onPointChange,
  onSaveChanges,
  onCancelChanges,
  onAwardAll,
  numGuests,
  isSaving = false,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
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
  const handlePointFieldChange = (utorid, userId, newValue, originalValue) => {
    if (onPointChange) {
      onPointChange(utorid, userId, newValue, originalValue);
    }
  };

  // Check if row has changes
  const hasChanges = (utorid) => utorid in pointChanges;

  // Get current value for TextField
  const getCurrentPointValue = (user) => {
    return pointChanges[user.utorid]?.newPoints ?? user.points;
  };

  const hasAnyChanges = Object.keys(pointChanges).length > 0;

  return (
    <>
      {hasAnyChanges ? (
        <SaveCancelButtons
          hasAnyChanges={hasAnyChanges}
          isSaving={isSaving}
          onCancelChanges={onCancelChanges}
          onSaveChanges={onSaveChanges}
          pointChanges={pointChanges}
        />
      ) : (
        <AwardAllButton
          onAwardAll={onAwardAll}
          numGuests={numGuests}
          isSaving={isSaving}
        />
      )}
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
              </>
            )}
            <TableCell sx={cellSx}>POINTS</TableCell>
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
                  </>
                )}
                <TableCell sx={bodyCellSx}>
                  {
                    user.event_role === "guest" ? (
                      <TextField
                        value={getCurrentPointValue(user)}
                        onChange={(e) => handlePointFieldChange(user.utorid, user.id, e.target.value, user.points)}
                        size="small"
                        disabled={isSaving}
                        sx={{
                          width: 64,
                          backgroundColor: hasChanges(user.utorid)
                            ? theme.palette.warning.light
                            : "FFFFFF",
                          color: theme.palette.text.primary,
                          fontWeight: 500,
                          borderRadius: 2,
                          "& .MuiInputBase-input": {
                            textAlign: "center",
                            padding: "6px 8px"
                          },
                        }}
                      />
                    ) : (
                      <Chip
                        label={user.points}
                        size="large"
                        variant="outlined"
                        sx={{
                          backgroundColor: theme.palette.grey[300],
                          color: theme.palette.text.primary,
                          fontWeight: 500,
                          minWidth: '4rem',
                          fontSize: "1rem",
                        }}
                      />
                    )
                  }
                </TableCell>
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
    </>
  );
}
