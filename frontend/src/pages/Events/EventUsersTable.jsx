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
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";

export default function UsersTable({ data }) {
  console.log(data);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  // Badge colors that rotate
  const badgeColors = [
    { bg: "#e8f5e8", text: "#2e7d32", border: "#4caf50" }, // Green
    { bg: "#ffebee", text: "#c62828", border: "#f44336" }, // Red
    { bg: "#e8f5e8", text: "#2e7d32", border: "#4caf50" }, // Green
    { bg: "#ffebee", text: "#c62828", border: "#f44336" }, // Red
  ];

  const getBadgeColor = (index) => {
    return badgeColors[index % badgeColors.length];
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
            <TableCell sx={cellSx}>USERNAME</TableCell>
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
          {data.map((user, index) => {
            const badgeColor = getBadgeColor(index);
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
                    #{index + 1}
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
                  <IconButton
                    size="small"
                    sx={{
                      color: "#f44336",
                      "&:hover": {
                        backgroundColor: "#ffebee",
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
