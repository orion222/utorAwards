import DetailsTemplate from "../../components/common/DetailsTemplate";
import { Box, Typography, Avatar, Alert, Stack, Button, Divider, Modal } from "@mui/material";
import VerifiedIcon from '@mui/icons-material/Verified';
import SavingsIcon from "@mui/icons-material/Savings";
import CakeIcon from "@mui/icons-material/Cake";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LoginIcon from "@mui/icons-material/Login";
import { useUser } from "../../context/UserContext";
import { useState } from "react";
import PromotionCard from "../../components/common/PromotionCard";
import PromoteUserForm from "./PromoteUserForm.jsx";
import EditUserForm from "./EditUserForm.jsx";
import StatusChip from '../../components/common/StatusChip.jsx';
import VerifyUserForm from "./VerifyUserForm.jsx";

function UserDetails() {
    const { user } = useUser();
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const [showPromoteModal, setShowPromoteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [userData, setUserData] = useState(null);
    const [verifyModal, setVerifyModal] = useState(null);

    const formatDate = (isoString) => {
        return new Date(isoString).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true });
    }

    const handlePromoteClick = (data) => {
        setUserData(data);
        setShowPromoteModal(true);
    };

    const handleEditClick = (data) => {
        setUserData(data);
        setShowEditModal(true);
    };

    const handleClosePromoteModal = () => {
        setShowPromoteModal(false);
        setUserData(null);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setUserData(null);
    };

    const handleVerify = (data) => {
        setUserData(data);
        setVerifyModal(true);
    }

    const handleCloseVerifyModal = () => {
        setVerifyModal(false);
        setUserData(null);
    };

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
                                    <VerifiedIcon sx={{ ml: 1, color: "#1591EA" }} />
                                )}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                User ID: {data.id}
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
                                    <StatusChip
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
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleEditClick(data)}
                                >
                                    Edit User
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handlePromoteClick(data)}
                                >
                                    Promote
                                </Button>
                                {!data.verified &&
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleVerify(data)}
                                    >
                                        Verify
                                    </Button>
                                }
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

                        <Box
                            sx={{
                                display: "grid",
                                gap: 2,
                                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }
                            }}
                        >
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Points
                                </Typography>
                                <Typography variant="body1" fontWeight="600">
                                    {data.points}
                                </Typography>
                            </Box>

                            {["manager", "superuser"].includes(user.role) && (
                                <>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Birthday
                                        </Typography>
                                        <Typography variant="body1" fontWeight="600">
                                            {data.birthday || "N/A"}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Role
                                        </Typography>
                                        <Typography variant="body1" fontWeight="600">
                                            {data.role}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Created
                                        </Typography>
                                        <Typography variant="body1" fontWeight="600">
                                            {formatDate(data.createdAt)}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Last Login
                                        </Typography>
                                        <Typography variant="body1" fontWeight="600">
                                            {data.lastLogin ? formatDate(data.lastLogin) : "N/A"}
                                        </Typography>
                                    </Box>
                                </>
                            )}
                        </Box>
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

                    {/* Promote User Modal */}
                    <Modal
                        open={showPromoteModal}
                        onClose={handleClosePromoteModal}
                        aria-labelledby="promote-user-modal"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Box>
                            {userData && (
                                <PromoteUserForm
                                    user={userData}
                                    onClose={handleClosePromoteModal}
                                />
                            )}
                        </Box>
                    </Modal>
                   <Modal
                        open={showEditModal}
                        onClose={handleCloseEditModal}
                        aria-labelledby="edit-user-modal"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Box>
                            {userData && (
                                <EditUserForm
                                    user={userData}
                                    onClose={handleCloseEditModal}
                                />
                            )}
                        </Box>
                    </Modal>
                    <Modal
                        open={verifyModal}
                        onClose={handleCloseVerifyModal}
                        aria-labelledby="verify-user-modal"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Box>
                            <VerifyUserForm
                                user={userData}
                                onClose={handleCloseVerifyModal}
                            />
                        </Box>
                    </Modal>
                </Box>
            )}
        </DetailsTemplate>
    );
}

export default UserDetails;