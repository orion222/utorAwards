import { useParams, useLocation } from "react-router-dom";
import PromotionCard from "../../components/common/PromotionCard";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/api"
import { Alert, Box, CircularProgress, Typography, Stack, Chip, useTheme } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import PaidIcon from "@mui/icons-material/Paid";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DetailsTemplate from "../../components/common/DetailsTemplate";

function PromotionDetails() {
    const theme = useTheme();

    const formatDate = (dateIsoString) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        }).format(new Date(dateIsoString));
    }

    return (
        <DetailsTemplate queryKey="promotion-details" apiEndpoint="/promotions">
            {data => (
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
                    <Stack direction="row" spacing={1}>
                        <Chip 
                            label={data.type.toUpperCase()}
                            size="medium"
                            sx={{
                                fontWeight: 600,
                                fontSize: "0.9rem",
                            }} 
                        />
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
                                    +{data.rate * 100}% Boosted Rate
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
                    </Box>
                </Box>                
            )}
        </DetailsTemplate>

    )
}

export default PromotionDetails;