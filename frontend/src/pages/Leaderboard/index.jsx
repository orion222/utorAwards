import { useQuery } from "@tanstack/react-query";
import api from "../../api/api";
import { Box, CircularProgress, Typography, Avatar, Paper, List, ListItem, ListItemAvatar, ListItemText  } from "@mui/material";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

function Leaderboard() {

    const fetchLeaderboardData = async () => {
        const res = await api.get("/users/leaderboard?limit=20");
        return res.data;
    }

    const { data, error, isFetching } = useQuery({
        queryKey: ["leaderboard"],
        queryFn: fetchLeaderboardData,
    });

    const [firstPlace, secondPlace, thirdPlace, ...rest] = data || [];

    return (
        <>
            <Typography variant="h4" gutterBottom>Leaderboard</Typography>
            {isFetching ? (
                <Box display="flex" justifyContent="center" p={4}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Box display="flex" justifyContent="center" p={4}>
                    <Typography variant="body1" color="error">
                        Something went wrong while fetching the leaderboard. Please try again later.
                    </Typography>
                </Box>
            ) : (
                <Box>
                    {data.length === 0 ? (
                        <Typography variant="body2" color="textSecondary">No users found</Typography>
                    ) : (
                        <>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    justifyContent: 'center',
                                    gap: { xs: 1, sm: 2 },
                                    mb: { xs: 2, sm: 4 },
                                }}
                            >
                                {/* 2nd Place */}
                                <Box sx={{ textAlign: 'center', width: { xs: 70, sm: 100 } }}>
                                    <Avatar
                                        sx={{
                                            width: { xs: 40, sm: 60 },
                                            height: { xs: 40, sm: 60 },
                                            mx: 'auto',
                                            mb: 1,
                                            bgcolor: '#C0C0C0',
                                        }}
                                        src={secondPlace?.avatarURL} 
                                        alt="Profile photo"
                                    />
                                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '1.25rem' } }}>
                                        {secondPlace?.utorid}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ fontSize: { xs: '0.65rem', sm: '0.875rem' } }}
                                    >
                                        {secondPlace?.grossPoints} points
                                    </Typography>
                                    <Paper
                                        sx={{
                                            height: { xs: 50, sm: 80 },
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            bgcolor: '#C0C0C0',
                                            mt: 1,
                                        }}
                                    >
                                    <Typography variant="h5" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                                        2
                                    </Typography>
                                    </Paper>
                                </Box>

                                {/* 1st Place */}
                                <Box sx={{ textAlign: 'center', width: { xs: 70, sm: 100 } }}>
                                    <EmojiEventsIcon sx={{ fontSize: { xs: 30, sm: 40 }, color: '#E6B800', mb: 1 }} />
                                    <Avatar
                                        sx={{
                                            width: { xs: 50, sm: 80 },
                                            height: { xs: 50, sm: 80 },
                                            mx: 'auto',
                                            mb: 1,
                                            background: '#E6B800',
                                        }}
                                        src={firstPlace?.avatarURL} 
                                        alt="Profile photo"
                                    />
                                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '1.25rem' } }}>
                                        {firstPlace?.utorid}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ fontSize: { xs: '0.65rem', sm: '0.875rem' } }}
                                    >
                                        {firstPlace?.grossPoints} points
                                    </Typography>
                                    <Paper
                                        sx={{
                                            height: { xs: 80, sm: 120 },
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: '#E6B800',
                                            mt: 1,
                                        }}
                                    >
                                    <Typography variant="h5" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                                        1
                                    </Typography>
                                    </Paper>
                                </Box>

                                {/* 3rd Place */}
                                <Box sx={{ textAlign: 'center', width: { xs: 70, sm: 100 } }}>
                                    <Avatar
                                        sx={{
                                            width: { xs: 40, sm: 60 },
                                            height: { xs: 40, sm: 60 },
                                            mx: 'auto',
                                            mb: 1,
                                            bgcolor: '#CD7F32',
                                        }}
                                        src={thirdPlace?.avatarURL} 
                                        alt="Profile photo"
                                    />
                                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '1.25rem' } }}>
                                        {thirdPlace?.utorid}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ fontSize: { xs: '0.65rem', sm: '0.875rem' } }}
                                    >
                                        {thirdPlace?.grossPoints} points
                                    </Typography>
                                    <Paper
                                        sx={{
                                            height: { xs: 40, sm: 60 },
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            bgcolor: '#CD7F32',
                                            mt: 1,
                                        }}
                                    >
                                    <Typography variant="h5" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                                        3
                                    </Typography>
                                    </Paper>
                                </Box>
                            </Box>

                            <List>
                                {rest.map((user, index) => (
                                    <ListItem
                                        key={index}
                                        sx={{
                                            bgcolor: 'background.paper',
                                            mb: 1,
                                            borderRadius: 1,
                                            py: { xs: 0.5, sm: 1 },
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                minWidth: { xs: 30, sm: 40 },
                                                fontWeight: 'bold',
                                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                            }}
                                        >
                                            {index + 4}
                                        </Typography>

                                        <ListItemAvatar>
                                            <Avatar sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }} src={user?.avatarURL} alt="Profile photo" />
                                        </ListItemAvatar>

                                        <ListItemText
                                            primary={user.utorid}
                                            secondary={`${user.grossPoints} points`}
                                            slotProps={{
                                                primary: {
                                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                                },
                                                secondary: {
                                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                                }
                                            }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    )}
                </Box>
            )}
        </>
    );
}

export default Leaderboard;