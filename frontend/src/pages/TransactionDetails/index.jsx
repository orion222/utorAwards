import { useParams, useLocation } from "react-router-dom";
import TransactionItemCard from "../../components/common/TransactionItemCard.jsx";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/api";
import { Alert, Box, CircularProgress, Typography, Stack, Chip, Divider } from "@mui/material";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

function TransactionDetails() {
    const { transactionId } = useParams();
    
    const { data, isFetching, error } = useQuery({
        queryKey: ["transaction-details", transactionId],
        queryFn: async () => {
            const response = await api.get(`/transactions/${transactionId}`);
            return response.data;
        },
        refetchOnWindowFocus: false,
        staleTime: 30 * 60 * 1000, // 30 minutes
    })

    if (isFetching) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50%' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50%' }}>
                <Alert severity="error">
                    An error occurred while fetching transaction details. {error.response?.status === 403 ? "You do not have the clearance to see this transaction" : "Server error"}
                </Alert>
            </Box>
        );
    }

    const typeToColour = {
        "purchase": "#7CD93A",
        "redemption": "#F59B66",
        "adjustment": "#F2B84B",
        "event": "#7DA4F2",
        "transfer": "#BBA3E5",
    }
    const dateString = new Date(data.createdAt).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true });

    return (
        <Box sx={{ my: 3, display: "flex", flexDirection: "column", gap: 3 }}>
            <Box>
                <Typography variant="h4" fontWeight="bold">
                    {data.type.charAt(0).toUpperCase() + data.type.slice(1)}
                </Typography>

                <Box
                    sx={{
                        width: "80px",
                        height: "4px",
                        borderRadius: 2,
                        backgroundColor: typeToColour[data.type],
                        mt: 0.5,
                    }}
                />
            </Box>       

            <Box>
                <Typography variant="subtitle1" color="text.secondary">
                    Transaction ID: {data.id}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Created at: {dateString}
                </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
                <Chip 
                    label={data.processed ? "PROCESSED" : "PENDING"}
                    color={data.processed ? "primary" : "warning"}
                    size="medium"
                    sx={{
                        fontWeight: 600,
                        fontSize: "0.9rem",
                    }} 
                />
                {data.suspicious && (
                    <Chip 
                        label="SUSPICIOUS"
                        color="error"
                        size="medium"
                        sx={{
                            fontWeight: 600,
                            fontSize: "0.9rem",
                        }} 
                    />
                )}
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
                {data.spent !== null && data.spent !== 0 && (
                    <Typography variant="body2" color="text.secondary">
                        Spent: ${data.spent.toFixed(2)}
                    </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                    {data.createdBy && data.amount > 0 && `From: ${data.createdBy}`} 
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {data.utorid && data.amount < 0 && `To: ${data.utorid}`}  
                </Typography>

                {data.remark && (
                <Typography
                    variant="body1"
                    sx={{ mt: 1, color: "text.primary" }}
                >
                    {data.remark}
                </Typography>
                )}
            </Box>

            {data.promotionIds && data.promotionIds.length > 0 && (
                <Box>
                    <Divider sx={{ mb: 2 }} />
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            flexWrap: "wrap",
                        }}
                    >
                        <LocalOfferIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                        <Typography sx={{ fontSize: "0.9rem", fontWeight: 500 }}>
                            Promotions Applied:
                        </Typography>
                        <Typography sx={{ fontSize: "0.9rem", color: "text.secondary" }}>
                            {data.promotionIds.map((id) => `Promo #${id}`).join(", ")}
                        </Typography>
                    </Box>
                </Box>
            )}

            <Box sx={{ textAlign: "center", mt: 1 }}>
                <Typography
                    variant="h3"
                    fontWeight="bold"
                    sx={{
                        color: data.amount > 0 ? "primary.main" : "error.main",
                    }}
                >
                    {data.amount > 0 ? `+${data.amount}` : data.amount} pts
                </Typography>
            </Box> 
        </Box>
    )
}

export default TransactionDetails;