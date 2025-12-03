import DetailsTemplate from "../../components/common/DetailsTemplate";
import { Box, Typography, Avatar, Alert, Stack, Chip, Button, Divider } from "@mui/material";
import VerifiedIcon from '@mui/icons-material/Verified';
import SavingsIcon from "@mui/icons-material/Savings";
import CakeIcon from "@mui/icons-material/Cake";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LoginIcon from "@mui/icons-material/Login";
import { useUser } from "../../context/UserContext";
import PromotionCard from "../../components/common/PromotionCard";

function UserDetails() {
    const { user } = useUser();
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const formatDate = (isoString) => {
        return new Date(isoString).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true });
    }

    return (
        <DetailsTemplate queryKey="user-details" apiEndpoint="/users">
            {data => (
                <Box sx={{ my: 3, display: "flex", flexDirection: "column", gap: 3 }}>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        <Avatar src={data?.avatarUrl ? `${backendURL}/${data.avatarUrl}` : null} alt="Profile photo" sx={{ width: 125, height: 125 }}>
                            <Typography variant="h2">{data.utorid.charAt(0).toUpperCase()}</Typography>
                        </Avatar>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                {data.name}
                                {data.verified && (
                                    <VerifiedIcon sx={{ ml: 1 }} />
                                )}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {data.utorid}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {data.email}
                            </Typography>
                        </Box>
                    </Box>
                    {["manager", "superuser"].includes(user.role) && (
                        <>
                            {data.suspicious && (
                                <Stack direction="row" gap={1}>
                                    <Chip 
                                        label="SUSPICIOUS"
                                        color="error"
                                        size="medium"
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: "0.9rem",
                                        }} 
                                    />
                                </Stack>                                
                            )}
                            <Stack direction="row" gap={1}>
                                <Button variant="contained" color="secondary">Edit User</Button>
                                <Button variant="contained" color="secondary">Promote</Button>
                            </Stack>                            
                        </>
                    )}

                    <Box
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            bgcolor: "background.paper",
                            border: "1px solid",
                            borderColor: "divider",
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            User Details
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <SavingsIcon sx={{ color: "primary.main" }} />
                            <Typography variant="body1">
                                <strong>Points:</strong> {data.points}
                            </Typography>
                        </Box>

                        {["manager", "superuser"].includes(user.role) && (
                            <>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                    <CakeIcon sx={{ color: "secondary.main" }} />
                                    <Typography variant="body1">
                                        <strong>Birthday:</strong> {data.birthday || "N/A"}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                    <BadgeIcon sx={{ color: "info.main" }} />
                                    <Typography variant="body1">
                                        <strong>Role:</strong> {data.role}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                    <CalendarMonthIcon sx={{ color: "success.main" }} />
                                    <Typography variant="body1">
                                        <strong>Created:</strong> {formatDate(data.createdAt)}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                    <LoginIcon sx={{ color: "warning.main" }} />
                                    <Typography variant="body1">
                                        <strong>Last Login:</strong>{" "}
                                        {data.lastLogin ? formatDate(data.lastLogin) : "N/A"}
                                    </Typography>
                                </Box>
                            </>
                        )}
                    </Box>

                    {data.promotions.length > 0 && (
                        <>
                            <Divider />
                            <Typography variant="h6" fontWeight="bold">Used Promotions</Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: {xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)'}, gap: 2 }}>
                                {data.promotions.map(promotion => (
                                    <PromotionCard promotion={promotion} key={promotion.id} />
                                ))}
                            </Box>                        
                        </>
                    )}
                </Box>
            )}
        </DetailsTemplate>
    );
}

export default UserDetails;