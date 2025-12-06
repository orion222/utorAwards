import { Box, Typography, Stack, Chip, Divider, ListItem, ListItemText, ListItemAvatar, Avatar, List } from "@mui/material";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DetailsTemplate from "../../components/common/DetailsTemplate.jsx";
import PromotionCard from "../../components/common/PromotionCard.jsx";

function TransactionDetails() {
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const typeToColour = {
        "purchase": "#7CD93A",
        "redemption": "#F59B66",
        "adjustment": "#F2B84B",
        "event": "#7DA4F2",
        "transfer": "#BBA3E5",
    }

    const formatDate = (isoString) => {
        return new Date(isoString).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true });
    }

    return (
        <DetailsTemplate queryKey="transaction-details" apiEndpoint="/transactions">
            {data  => (
                <Box sx={{ my: 3, display: "flex", flexDirection: "column", gap: 3 }}>
                    <Box>
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}> 
                            <Typography variant="h4" fontWeight="bold">
                                {data.type.charAt(0).toUpperCase() + data.type.slice(1)}
                            </Typography>
                            <Typography
                                variant="h4"
                                fontWeight="bold"
                                sx={{
                                    color: data.amount > 0 ? "primary.main" : "error.main",
                                }}
                            >
                                ({data.amount > 0 ? `+${data.amount}` : data.amount} pts)
                            </Typography>
                        </Box>

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

                    <Box sx={{ display: "flex", flexDirection: "row", gap: { xs: 1, sm: 3 }, flexWrap: "wrap" }}>
                        <Typography variant="subtitle1" color="text.secondary">
                            Transaction ID: {data.id}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            Created at: {formatDate(data.createdAt)}
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
                        <Typography variant="h6" fontWeight="bold">Description</Typography>
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

                    {(data.user || data.targetUser) && (
                        <>
                            <Divider />
                            <Typography variant="h6" fontWeight="bold">Related Users</Typography>
                            <List sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)" }, gap: 2 }}>
                                {data.user && (
                                    <ListItem                       
                                        sx={{
                                            bgcolor: "background.paper",
                                            mb: 1,
                                            borderRadius: 2,
                                            border: "1px solid",
                                            borderColor: "divider"
                                        }} 
                                    >
                                        <ListItemAvatar><Avatar src={data.user.avatarUrl ? `${backendURL}/${data.user.avatarUrl}` : undefined} /></ListItemAvatar>
                                        <ListItemText primary={data.user.name} secondary={data.user.utorid} />
                                    </ListItem>
                                )}
                                {data.targetUser && data.targetUser.utorid !== data.user?.utorid && (
                                    <ListItem                       
                                        sx={{
                                            bgcolor: "background.paper",
                                            mb: 1,
                                            borderRadius: 2,
                                            border: "1px solid",
                                            borderColor: "divider"
                                        }} 
                                    >
                                        <ListItemAvatar><Avatar src={data.targetUser.avatarUrl ? `${backendURL}/${data.targetUser.avatarUrl}` : undefined} /></ListItemAvatar>
                                        <ListItemText primary={data.targetUser.name} secondary={data.targetUser.utorid} />
                                    </ListItem> 
                                )}                                
                            </List>
                        </>
                    )}
                    
                    {data.promotions.length > 0 && (
                        <>
                            <Divider />
                            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                <LocalOfferIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                                <Typography variant="h6" fontWeight="bold">
                                    Applied Promotions
                                </Typography>
                            </Box>

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

    )
}

export default TransactionDetails;