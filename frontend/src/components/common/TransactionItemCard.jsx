import { Card, CardContent, Stack, Chip, Box, Typography, Accordion, AccordionSummary, useMediaQuery, useTheme, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function TransactionItemCard({ transaction }) {
    const theme = useTheme();
    const isSmall = useMediaQuery("(max-width: 670px)");
    const { type, spent, amount, remark, user, targetUser, processed, suspicious, createdAt } = transaction;
    const typeToColour = {
        "purchase": "#7CD93A",
        "redemption": "#F59B66",
        "adjustment": "#F2B84B",
        "event": "#7DA4F2",
        "transfer": "#BBA3E5",
    }
    const dateString = new Date(createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", });

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
                    m: 2,
                    width: "100%",
                    maxWidth: "unset",
                    flex: 1,
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
                        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 0.25 }}>
                            <Typography 
                                fontWeight={700} 
                                sx={{ fontSize: "1rem", display: "flex", alignItems: "center", gap: 1 }}
                            >
                                {type.toUpperCase()}
                                <Typography 
                                    component="span" 
                                    fontWeight={600} 
                                    color={amount > 0 ? "primary" : "error"}
                                >
                                    ({amount > 0 ? `+${amount}` : amount} pts)
                                </Typography>
                            </Typography>
                            <Typography fontWeight={500}>{truncatedRemark}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {dateString}
                            </Typography>
                        </Box>
                    </AccordionSummary>

                    <AccordionDetails sx={{ mt: -1 }}>
                        {spent !== 0 && <Typography variant="body2" color="text.secondary">Spent: ${spent}</Typography>}
                        <Typography variant="body2" color="text.secondary">
                            {user && `Created by ${user.utorid}`}
                            {targetUser && user && " | "}
                            {targetUser && amount > 0 && `Sent by ${targetUser.utorid}`} 
                            {targetUser && amount < 0 && `Sent to ${targetUser.utorid}`}  
                        </Typography>
                        <Stack direction="row" spacing={1} mt={2}>
                            <Chip 
                                label={processed ? "PROCESSED" : "UNPROCESSED"}
                                color={processed ? "primary" : ""}
                                variant={processed ? "" : "outlined"}
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
                m: 2,
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
                <Box sx={{ display: "flex", alignItems: "center" }}>
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
                                label={processed ? "PROCESSED" : "UNPROCESSED"}
                                color={processed ? "primary" : ""}
                                variant={processed ? "" : "outlined"}
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
                        <Typography fontWeight={600}>{truncatedRemark}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {user && `Created by ${user.utorid}`}
                            {targetUser && user && " | "}
                            {targetUser && amount > 0 && `Sent by ${targetUser.utorid}`} 
                            {targetUser && amount < 0 && `Sent to ${targetUser.utorid}`}  
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
                        <Typography variant="h4" color={amount > 0 ? "primary" : "error"} fontWeight="bold">
                            {amount > 0 ? `+${amount}` : amount} pts
                        </Typography>
                        {spent !== 0 && <Typography variant="body2" color="text.secondary">Spent: ${spent}</Typography>}
                        <Typography variant="body2" color="text.secondary">{dateString}</Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )
}

export default TransactionItemCard;