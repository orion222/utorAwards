import { useParams, useLocation } from "react-router-dom";
import PromotionCard from "../../components/common/PromotionCard";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/api"
import { Alert, Box, CircularProgress, Modal, Typography, Stack, Chip, useTheme, Button, useMediaQuery } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { FiEdit, FiTrash } from "react-icons/fi";
import PaidIcon from "@mui/icons-material/Paid";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DetailsTemplate from "../../components/common/DetailsTemplate";
import { useUser } from "../../context/UserContext.jsx";
import { useState, useEffect } from "react";
import EditPromotionForm from "./EditPromotionForm.jsx";
import FormCard from "../../components/common/FormCard.jsx";
import DeletePromotionForm from "./DeletePromotionForm.jsx";
import StatusChip from "../../components/common/StatusChip.jsx";


function PromotionDetails() {
    const theme = useTheme();
    const {user} = useUser();
    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const isSmall = useMediaQuery("(max-width: 670px)");

    const formatDate = (dateIsoString) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        }).format(new Date(dateIsoString));
    }

    return (
        <DetailsTemplate queryKey="promotion-details" apiEndpoint="/promotions">
            {(data) => (
                <Box sx={{ my: 3, display: "flex", flexDirection: "column", gap: 3 }}>
                    <Typography variant="h4" fontWeight="bold">
                        {data.name}
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "row", gap: { xs: 1, sm: 3 }, flexWrap: "wrap" }}>
                        <Typography variant="subtitle1" color="text.secondary">
                            Promotion ID: {data.id}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                            <CalendarTodayIcon sx={{ color: theme.palette.text.secondary}} />
                            {data.startTime && data.endTime && (
                                <Typography variant="subtitle1" color="text.secondary">
                                    {`${formatDate(data.startTime)} - ${formatDate(data.endTime)}`}
                                </Typography>
                            )}
                            {!data.startTime && data.endTime && (
                                <Typography variant="subtitle1" color="text.secondary">
                                    {`Until ${formatDate(data.endTime)}`}
                                </Typography>
                            )}                    
                        </Box>
                    </Box>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                        <StatusChip 
                            label={data.type.toUpperCase()}
                            size="small"
                            sx={{
                                paddingTop: 2,
                                paddingBottom: 2,
                                paddingLeft: 1,
                                paddingRight: 1,
                            }}
                        />
                         {["manager", "superuser"].includes(user.role) && (
                            <>
                                <Button
                                    startIcon={<FiEdit color="grey" />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditModal(true)
                                    }}
                                    sx={{
                                        fontSize: 12,
                                        color: "grey",
                                        borderRadius: "8px",
                                        width: "fit-content",
                                        "&:hover": { backgroundColor: theme.palette.action.hover },
                                    }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    startIcon={<FiTrash color="red" />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteModal(true)
                                    }}
                                    sx={{
                                        fontSize: 12,
                                        color: "red",
                                        borderRadius: "8px",
                                        width: "fit-content",
                                        "&:hover": { backgroundColor: theme.palette.action.hover },
                                    }}
                                >
                                    Delete
                                </Button>                            
                            </>
                        )}
                        <Modal
                            open={editModal}
                            onClose={(e) => {
                                e.stopPropagation();
                                setEditModal(false)
                            }}
                            sx={{
                                position: "fixed",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: "rgba(0,0,0,0.5)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 1300,
                            }}
                        >
                            <Box sx={{width: isSmall ? "100%":"50%"}}>
                                <EditPromotionForm
                                    promotion={data}
                                    onClose={() => setEditModal(false)}      
                                />
                            </Box>
                        </Modal>
                        <Modal
                            open={deleteModal}
                            onClose={(e) => {
                                e.stopPropagation();
                                setDeleteModal(false)
                            }}
                            sx={{
                                position: "fixed",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: "rgba(0,0,0,0.5)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 1300,
                            }}
                        >
                            <Box sx={{width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center'}}>
                                <DeletePromotionForm
                                    promotion={data}
                                    onClose={() => setDeleteModal(false)}      
                                />
                            </Box>
                        </Modal>
                    </Stack>
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "background.paper",
                            border: "1px solid",
                            borderColor: "divider",
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold">
                            Description
                        </Typography>
                        {data.rate && (
                            <Box sx={{ display: "flex", gap: 1, mb: 0.5, alignItems: "center" }}>
                                <StarIcon sx={{ color: theme.palette.custom.accent}}/>
                                <Typography variant="body2" sx={{ color: theme.palette.custom.accent}}>
                                    {Math.round(+data.rate * 100)}% Boosted Rate
                                </Typography>
                            </Box>
                        )}
                        {data.points && (
                            <Box sx={{ display: "flex", gap: 1, mb: 0.5, alignItems: "center" }}>
                                <PaidIcon sx={{ color: theme.palette.custom.accent}}/>
                                <Typography variant="body2" sx={{ color: theme.palette.custom.accent}}>
                                    {data.points} Bonus Points
                                </Typography>
                            </Box>
                        )}
                        <Typography variant="body2" color="text.secondary">
                            {data.description} 
                        </Typography>
                        {data.minSpending && (
                            <Typography variant="body2" color="text.secondary" sx={{fontStyle: "italic"}}>
                                Minimum purchase of ${data.minSpending}
                            </Typography>
                        )}
                    </Box>
                </Box>                
            )}
        </DetailsTemplate>

    )
}

export default PromotionDetails;