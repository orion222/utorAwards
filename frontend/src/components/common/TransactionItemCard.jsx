import { Card, CardContent, Stack, Chip, Box, Typography, Accordion, AccordionSummary, useMediaQuery, useTheme, AccordionDetails, Divider } from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function TransactionItemCard({ transaction }) {
    const isSmall = useMediaQuery("(max-width: 670px)");
    const { type, spent, amount, earned, remark, user, targetUser, processed, suspicious, createdAt, promotionIds } = transaction;
    const typeToColour = {
        "purchase": "#7CD93A",
        "redemption": "#F59B66",
        "adjustment": "#F2B84B",
        "event": "#7DA4F2",
        "transfer": "#BBA3E5",
    }

    const dateString = new Date(createdAt).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true });

    function truncateStr(str) {
        let truncated = remark;
        if (isSmall && str.length > 20) {
            truncated = str.substring(0 , 20) + "...";
        }
        else if (!isSmall && str.length > 100) {
            truncated = str.substring(0 , 100) + "...";
        }
        return truncated;
    }

    const truncatedRemark = truncateStr(remark);

    if (isSmall) {
        return (
            <Box 
                sx={{ 
                    mb: 2,
                    width: "100%",
                    maxWidth: "unset",
                    flex: 1
                }}
            >
                <Accordion
                    sx={{
                        width: "100%",
                        borderLeft: `4px solid ${typeToColour[type]}`,
                        borderRadius: 3,
                    }}    
                >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', pr: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'start', gap: 0.5, flexDirection: "column" }}>
                                <Box sx={{ display: 'flex', gap: 0.5, alignItems: "center" }}>
                                    <Chip
                                        label={type.toUpperCase()}
                                        size="small"
                                        variant="outlined"
                                    />
                                    {promotionIds.length !== 0 && (
                                        <LocalOfferIcon sx={{ fontSize: 18, color: "primary.main" }} />
                                    )}                                    
                                </Box>

                                <Typography variant="body3" color="text.secondary">
                                    {dateString} 
                                </Typography>
                                {(spent && spent !== 0) && <Typography variant="body3" color="text.secondary">Spent: ${spent.toFixed(2)}</Typography>}
                            </Box>

                            <Typography
                                variant="h6"
                                color={type === "transfer" ? amount > 0 ? "primary" : "error" : earned > 0 ? "primary" : "error"}
                                fontWeight="bold">
                                {type === "transfer" ? amount > 0 ? `+${amount}` : amount : earned > 0 ? `+${earned}` : earned} pts
                            </Typography>
                        </Box>
                    </AccordionSummary>

                    <AccordionDetails sx={{ mt: -1 }}>
                        <Typography variant="body2" color="text.secondary">
                            {remark} 
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {targetUser && amount > 0 && `From: ${targetUser.utorid}`} 
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {targetUser && amount < 0 && `To: ${targetUser.utorid}`}  
                        </Typography>
                        <Stack direction="row" spacing={1} my={2}>
                            <Chip 
                                label={processed ? "PROCESSED" : "PENDING"}
                                color={processed ? "primary" : "warning"}
                                size="small"
                            />
                            {suspicious && (
                                <Chip 
                                    label="SUSPICIOUS" 
                                    color="error" 
                                    size="small" 
                                />                                
                            )}
                        </Stack>
                        {promotionIds.length !== 0 && (
                            <>
                                <Divider />
                                <Box mt={2} sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                                    <LocalOfferIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                                    <Typography sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
                                        {promotionIds.map((id, idx) => 
                                            `Promo #${id}${idx !== promotionIds.length - 1 ? ", " : ""}`
                                        )}
                                    </Typography>
                                </Box>                       
                            </>
                        )}
                    </AccordionDetails>
                </Accordion>
            </Box>
        );
    }

    return (
        <Card 
            variant="outlined" 
            sx={{ 
                width: "100%",
                maxWidth: "unset",
                flex: 1,
                borderRadius: 3,
                position: "relative",
                overflow: "visible",
            }}
        >
            {/* Colour strip */}
            <Box
                sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "4px",
                    bgcolor: typeToColour[type],
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 12,
                }}
            />

            {/* Main content */}
            <CardContent sx={{ px: 4, py: 2 }}>
                <Box mb={2} sx={{ display: "flex", alignItems: "center" }}>
                    <Box sx={{ flex: 1, pr: 2 }}>
                        <Stack direction="row" spacing={1} mb={2}>
                            <Chip 
                                label={type.toUpperCase()}
                                variant="outlined" 
                                size="medium" 
                                sx={{
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                }} 
                            />
                            <Chip 
                                label={processed ? "PROCESSED" : "PENDING"}
                                color={processed ? "primary" : "warning"}
                                size="medium" 
                                sx={{
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                }} 
                            />
                            {suspicious && (
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
                        <Typography variant="h7">{remark}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {targetUser && amount > 0 && `From: ${targetUser.utorid}`} 
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {targetUser && amount < 0 && `To: ${targetUser.utorid}`}  
                        </Typography>
                    </Box>

                    <Box 
                        sx={{  
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "flex-end",
                            textAlign: "right",
                        }}
                    >
                        <Typography
                            variant="h4"
                            color={type === "transfer" ? amount > 0 ? "primary" : "error" : earned > 0 ? "primary" : "error"}
                            fontWeight="bold">
                            {type === "transfer" ? amount > 0 ? `+${amount}` : amount : earned > 0 ? `+${earned}` : earned} pts
                        </Typography>
                        {(spent && spent !== 0) && <Typography variant="body2" color="text.secondary">Spent: ${spent.toFixed(2)}</Typography>}
                        <Typography variant="body2" color="text.secondary">{dateString}</Typography>
                    </Box>
                </Box>
                {promotionIds.length !== 0 && (
                    <>
                        <Divider />
                        <Box mt={2} sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                            <LocalOfferIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                            <Typography sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
                                {promotionIds.map((id, idx) => 
                                    `Promo #${id}${idx !== promotionIds.length - 1 ? ", " : ""}`
                                )}
                            </Typography>
                        </Box>                     
                    </>
                )}
            </CardContent>
        </Card>
    )
}

export default TransactionItemCard;